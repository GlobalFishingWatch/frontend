import React, {
  memo,
  Fragment,
  useEffect,
  createRef,
  useContext,
  useCallback,
  useMemo,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createSliderWithTooltip, Range as SliderRange } from 'rc-slider'
import './range.css'
import TimebarComponent, {
  TimebarTracks,
  Timebar,
  // TimebarActivity,
  TimebarTracksEvents,
  TimelineContext,
  TimebarHighlighter,
} from '@globalfishingwatch/timebar'
import {
  useSegmentsLabeledConnect,
  useTimebarModeConnect,
  useTimerangeConnect,
} from '../../features/timebar/timebar.hooks'
import {
  selectColorMode,
  selectFilteredDistanceFromPort,
  selectFilteredElevation,
  selectFilteredHours,
  selectFilteredSpeed,
  selectProjectColors,
  selectTimebarMode,
} from '../../routes/routes.selectors'
import { VesselPoint } from '../../types'
import { selectedtracks } from '../../features/vessels/selectedTracks.slice'
import { Field } from '../../data/models'
import {
  setHighlightedTime,
  disableHighlightedTime,
  selectHighlightedTime,
  selectTooltip,
  setTooltip,
  selectHighlightedEvent,
} from './timebar.slice'
import styles from './Timebar.module.css'
import {
  getTracksData,
  selectTracksGraphs,
  selectVesselDirectionPoints,
  getEventsForTracks,
  selectNightLayer,
} from './timebar.selectors'
import TimebarSelector from './selector/Selector'

// This displays the positions of the vessel in the timebar styled by speed and adds the
// posibility of click them to select a segment
const DirectionTimebarChildren = ({ vesselPoints }: { vesselPoints: VesselPoint[] }) => {
  // TODO: Performance issue if we have lot of points
  const { outerScale, outerHeight } = useContext(TimelineContext)
  const timebarMode = useSelector(selectTimebarMode)
  const colorMode = useSelector(selectColorMode)
  const projectColors = useSelector(selectProjectColors)
  const [positionScale, minValue, maxValue] = useMemo(() => {
    // TODO: When loading the track detect the min and max values for
    // all the fields and store them in the state to use them here
    const { min, max } =
      timebarMode === Field.speed
        ? { min: 0, max: 22 }
        : timebarMode === Field.distanceFromPort
        ? { min: 0, max: 13000 }
        : timebarMode === Field.elevation
        ? { min: -4000, max: 500 }
        : { min: null, max: null }
    const range = max !== null && min !== null ? max - min : null
    return [range, min, max]
  }, [timebarMode])

  const segments = useSelector(selectedtracks)
  const dispatch = useDispatch()
  const { onEventPointClick } = useSegmentsLabeledConnect()
  const handleEventClick = useCallback(
    (e: VesselPoint) => {
      const position = {
        latitude: e.position.lat,
        longitude: e.position.lon ?? 1,
      }
      onEventPointClick(segments, e.timestamp, position)
    },
    [onEventPointClick, segments]
  )

  const gradient = 'linear-gradient(0deg, #FF6B6B 0px, #CC4AA9 40px, #185AD0 80px)'
  const topMargin = 15
  const points = useMemo(
    () =>
      minValue === null || maxValue === null || positionScale === null
        ? []
        : vesselPoints.map((vesselPoint) => {
            const startX = outerScale(new Date(vesselPoint.timestamp))
            const yPosition =
              timebarMode === Field.speed
                ? vesselPoint.speed
                : timebarMode === Field.distanceFromPort
                ? vesselPoint.distanceFromPort
                : timebarMode === Field.elevation
                ? vesselPoint.elevation
                : 1
            const backgroundPositionY =
              Math.abs(yPosition - minValue) * ((outerHeight - 20 - topMargin) / positionScale)
            const bottom =
              Math.abs(yPosition - minValue) * ((outerHeight - 20 - topMargin) / positionScale) + 15
            return {
              vesselPoint,
              startX,
              backgroundImage: colorMode === 'all' || colorMode === 'content' ? gradient : '',
              backgroundPositionY,
              bottom,
              borderColor:
                colorMode === 'all' || colorMode === 'labels'
                  ? projectColors[vesselPoint.action]
                  : 'transparent',
            }
          }),
    [
      colorMode,
      maxValue,
      minValue,
      outerHeight,
      outerScale,
      positionScale,
      projectColors,
      timebarMode,
      vesselPoints,
    ]
  )
  if (!positionScale || minValue === null || maxValue === null) {
    return null
  }
  return (
    <Fragment>
      {points.map(
        (
          { vesselPoint, startX, backgroundImage, backgroundPositionY, borderColor, bottom },
          index: number
        ) => {
          return (
            <Fragment key={`dtc-${index}`}>
              <span
                key={index}
                onClick={() => handleEventClick(vesselPoint)}
                style={{
                  borderRadius: '50%',
                  backgroundImage,
                  backgroundPositionY: backgroundPositionY,
                  backgroundAttachment: 'fixed',
                  position: 'absolute',
                  left: startX,
                  cursor: 'default',
                  border: '1px solid #8091AB',
                  borderColor,
                  width: '7px',
                  bottom: bottom,
                  height: 7,
                }}
              ></span>
              <span
                key={`vertical-${index}`}
                className={styles.vesselEventPlaceholder}
                onMouseEnter={() =>
                  dispatch(
                    setTooltip({
                      tooltip:
                        Math.round(vesselPoint.speed * 100) / 100 +
                        'kt' +
                        (vesselPoint.elevation
                          ? ', ' + Math.round(vesselPoint.elevation) + 'm'
                          : ''),
                    })
                  )
                }
                style={{
                  width: '2px',
                  position: 'absolute',
                  cursor: 'default',
                  bottom: 0,
                  left: startX + 2,
                  height: outerHeight,
                }}
              ></span>
            </Fragment>
          )
        }
      )}
    </Fragment>
  )
}

const DayNightTimebarLayer = () => {
  // TODO: Performance issue if we have lot of points
  const { outerScale } = useContext(TimelineContext)
  const nightSegments = useSelector(selectNightLayer)
  return (
    <div>
      {nightSegments.flatMap((segment) => {
        const startX = outerScale(new Date(segment.from))
        const endX = outerScale(new Date(segment.to))
        const width = endX - startX
        if (segment.isNight) {
          return null
        }
        return (
          <svg
            key={segment.from}
            height="100%"
            style={{
              background:
                'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 42.17%, rgba(255,255,255,0) 100%)',
              position: 'absolute',
              left: startX,
              opacity: 0.2,
              cursor: 'default',
              border: 'none',
              top: 0,
              width: width,
              height: '100%',
            }}
          ></svg>
        )
      })}
    </div>
  )
}

const TimebarWrapper = () => {
  const {
    start,
    end,
    dispatchTimerange,
    dispatchSpeed,
    dispachHours,
    dispachElevation,
    dispachDistanceFromPort,
  } = useTimerangeConnect()
  const highlightedTime = useSelector(selectHighlightedTime)
  const highlightedEvent = useSelector(selectHighlightedEvent)
  const { filterMode } = useTimebarModeConnect()
  const tracks = useSelector(getTracksData)

  const dispatch = useDispatch()

  const myRef = createRef<any>()
  const { minSpeed, maxSpeed } = useSelector(selectFilteredSpeed)
  const { minElevation, maxElevation } = useSelector(selectFilteredElevation)
  const { minDistanceFromPort, maxDistanceFromPort } = useSelector(selectFilteredDistanceFromPort)
  const { fromHour, toHour } = useSelector(selectFilteredHours)
  const vesselPoints = useSelector(selectVesselDirectionPoints)

  const tracksGraph = useSelector(selectTracksGraphs)
  const tracksEvents = useSelector(getEventsForTracks)

  //Those three handlers update the filters when we modify the Range
  const handleSpeedChange = (values: number[]) => {
    dispatchSpeed(values)
  }
  const handleElevationChange = (values: number[]) => {
    dispachElevation(values)
  }
  const handleDistanceFromPortChange = (values: number[]) => {
    dispachDistanceFromPort(values)
  }
  const handleTimeChange = (values: number[]) => {
    dispachHours(values)
  }

  // Transform the range slider for filter the timebar to vertical style
  useEffect(() => {
    if (myRef !== null && myRef.current !== null) {
      // OR HERE? console.log(myRef.current.value)
      myRef.current.setAttribute('orientation', 'vertical')
    }
  }, [myRef])

  const Range = createSliderWithTooltip(SliderRange)

  const tooltip = useSelector(selectTooltip)
  const absoluteStart = new Date('2012-01-01')
  const absoluteEnd = new Date()

  return (
    <Fragment>
      <div className={styles.timebarContainer}>
        {tooltip && <div className={styles.pointTooltip}>{tooltip}</div>}
        <Timebar
          start={start}
          end={end}
          enablePlayback={false}
          absoluteStart={absoluteStart.toISOString()}
          absoluteEnd={absoluteEnd.toISOString()}
          onChange={dispatchTimerange}
          isResizable={true}
          //bookmarkStart={bookmarkStart}
          //bookmarkEnd={bookmarkEnd}
          showLastUpdate={false}
          //onBookmarkChange={dispatchBookmarkTimerange}
          onMouseMove={(clientX: number, scale: (arg: number) => Date) => {
            if (clientX === null) {
              if (highlightedTime !== undefined) {
                dispatch(disableHighlightedTime())
              }
              return
            }
            const start = scale(clientX - 10).toISOString()
            const end = scale(clientX + 10).toISOString()
            dispatch(setHighlightedTime({ start, end }))
          }}
        >
          {(props: any) => (
            <Fragment>
              <DayNightTimebarLayer></DayNightTimebarLayer>
              <DirectionTimebarChildren vesselPoints={vesselPoints} />
              {
                <Fragment>
                  {tracks.length && <TimebarTracks key="tracks" tracks={tracks} />}
                  {tracksEvents.length && (
                    <Fragment>{<TimebarTracksEvents key="events" />}</Fragment>
                  )}
                </Fragment>
              }
              {/* {tracks.length && false && (
                <TimebarActivity
                  key="trackActivity"
                  opacity={0.7}
                  // curve="curveBasis"
                  graphTracks={tracksGraph}
                />
              )} */}
              <Fragment>
                {highlightedTime && (
                  <TimebarHighlighter
                    hoverStart={highlightedTime.start}
                    hoverEnd={highlightedTime.end}
                    unit="knots"
                  />
                )}
              </Fragment>
              <Fragment>
                {highlightedEvent && (
                  <TimebarHighlighter
                    hoverStart={highlightedEvent.start}
                    hoverEnd={highlightedEvent.end}
                    unit="knots"
                  />
                )}
              </Fragment>
            </Fragment>
          )}
        </Timebar>
      </div>
      <div className={styles.filtersContainer}>
        {filterMode === Field.speed && (
          <Range
            min={0}
            max={15}
            step={0.1}
            vertical
            onAfterChange={handleSpeedChange}
            allowCross={false}
            tipFormatter={(value) => `${value} kt`}
            tipProps={{ placement: 'right' }}
            defaultValue={[minSpeed, maxSpeed]}
          />
        )}
        {filterMode === Field.timestamp && (
          <Range
            min={0}
            max={24}
            step={1}
            vertical
            onAfterChange={handleTimeChange}
            allowCross={false}
            tipFormatter={(value) => `${value} hs`}
            tipProps={{ placement: 'right' }}
            defaultValue={[fromHour, toHour]}
          />
        )}
        {filterMode === Field.elevation && (
          <Range
            min={-4000}
            max={500}
            step={1}
            vertical
            onAfterChange={handleElevationChange}
            allowCross={false}
            tipFormatter={(value) => `${value} mt`}
            tipProps={{ placement: 'right' }}
            defaultValue={[minElevation, maxElevation]}
          />
        )}
        {filterMode === Field.distanceFromPort && (
          <Range
            min={0}
            max={10000}
            step={1}
            vertical
            onAfterChange={handleDistanceFromPortChange}
            allowCross={false}
            tipFormatter={(value) => `${value} mt`}
            tipProps={{ placement: 'right' }}
            defaultValue={[minDistanceFromPort, maxDistanceFromPort]}
          />
        )}
        <TimebarSelector />
      </div>
    </Fragment>
  )
}

export default memo(TimebarWrapper)
