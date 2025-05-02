import React, {
  createRef,
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import Hotkeys from 'react-hot-keys'
import { useSelector } from 'react-redux'
import type { NumberValue } from 'd3-scale'
import { debounce } from 'es-toolkit'
import Slider from 'rc-slider'

import type { TimebarProps } from '@globalfishingwatch/timebar'
import {
  getNextStep,
  Timebar,
  TimebarHighlighter,
  TimelineContext,
} from '@globalfishingwatch/timebar'

import { Field } from '../../data/models'
import { useTimebarModeConnect, useTimerangeConnect } from '../../features/timebar/timebar.hooks'
import {
  selectFilteredDistanceFromPort,
  selectFilteredElevation,
  selectFilteredHours,
  selectFilteredSpeed,
} from '../../routes/routes.selectors'
import { useAppDispatch } from '../../store.hooks'

import TimebarSelector from './selector/Selector'
import { selectNightLayer, selectRangeFilterLimits } from './timebar.selectors'
import {
  disableHighlightedTime,
  selectHighlightedEvent,
  selectHighlightedTime,
  selectTooltip,
  setHighlightedTime,
} from './timebar.slice'
import { VesselEventsPointsGraphDeckGL } from './VesselEventsPointsGraphDeckGL'

import './range.css'
import styles from './Timebar.module.css'

const TIMEBAR_DEFAULT_HEIGHT = 300

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

const absoluteStart = new Date('2012-01-01')
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

  const [localRange, setLocalRange] = useState({
    start,
    end,
  })

  const highlightedTime = useSelector(selectHighlightedTime)
  const highlightedEvent = useSelector(selectHighlightedEvent)
  const { filterMode } = useTimebarModeConnect()

  const dispatch = useAppDispatch()

  const debouncedDispatchTimerange = useMemo(
    () =>
      debounce((timerange: { start: string; end: string }) => dispatchTimerange(timerange), 1000),
    [dispatchTimerange]
  )

  const onTimebarChange: TimebarProps['onChange'] = useCallback(
    ({ start, end }) => {
      setLocalRange({ start, end })
      debouncedDispatchTimerange({ start, end })
    },
    [debouncedDispatchTimerange]
  )

  const myRef = createRef<any>()
  const { minSpeed, maxSpeed } = useSelector(selectFilteredSpeed)
  const { minElevation, maxElevation } = useSelector(selectFilteredElevation)
  const { minDistanceFromPort, maxDistanceFromPort } = useSelector(selectFilteredDistanceFromPort)
  const { fromHour, toHour } = useSelector(selectFilteredHours)
  const rangeLimits = useSelector(selectRangeFilterLimits)
  //Those three handlers update the filters when we modify the Range
  const handleSpeedChange = (values: number[] | number) => {
    dispatchSpeed(values as number[])
  }
  const handleElevationChange = (values: number[] | number) => {
    dispachElevation(values as number[])
  }
  const handleDistanceFromPortChange = (values: number[] | number) => {
    dispachDistanceFromPort(values as number[])
  }
  const handleTimeChange = (values: number[] | number) => {
    dispachHours(values as number[])
  }

  // Transform the range slider for filter the timebar to vertical style
  useEffect(() => {
    if (myRef !== null && myRef.current !== null) {
      // OR HERE? console.log(myRef.current.value)
      myRef.current.setAttribute('orientation', 'vertical')
    }
  }, [myRef])

  const tooltip = useSelector(selectTooltip)
  const absoluteEnd = new Date()

  const onTimebarNavigation = useCallback(
    (keyName: string) => {
      const key = keyName.replace('shift+', '')
      const deltaMultiplicator = key === 'left' ? -1 : 1
      const { start, end } = getNextStep({
        start: localRange.start,
        end: localRange.end,
        absoluteStart: absoluteStart.toISOString(),
        deltaMultiplicator,
      })
      if (start && end) {
        onTimebarChange({ start, end })
      }
    },
    [localRange.start, localRange.end, onTimebarChange]
  )

  return (
    <Fragment>
      <Hotkeys keyName="shift+left,shift+right" onKeyUp={onTimebarNavigation}></Hotkeys>
      <div className={styles.timebarContainer}>
        {tooltip && <div className={styles.pointTooltip}>{tooltip}</div>}
        <Timebar
          start={localRange?.start}
          end={localRange?.end}
          showPlayback={false}
          absoluteStart={absoluteStart.toISOString()}
          absoluteEnd={absoluteEnd.toISOString()}
          onChange={onTimebarChange}
          isResizable={true}
          showLast30DaysBtn={false}
          defaultHeight={TIMEBAR_DEFAULT_HEIGHT}
          trackGraphOrientation={'up'}
          //bookmarkStart={bookmarkStart}
          //bookmarkEnd={bookmarkEnd}
          // showLastUpdate={false}
          //onBookmarkChange={dispatchBookmarkTimerange}
          onMouseMove={(clientX: number | null, scale: ((arg: NumberValue) => Date) | null) => {
            if (clientX === null || scale === null) {
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
          <Fragment>
            <DayNightTimebarLayer></DayNightTimebarLayer>
            <VesselEventsPointsGraphDeckGL />
            {/* {
              <Fragment>
                {tracks.length && <TimebarTracks key="tracks" data={tracks as any} />}
                {tracksEvents.length && (
                  <Fragment>{<TimebarTracksEvents key="events" data={tracksEvents} />}</Fragment>
                )}
              </Fragment>
            } */}
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
                />
              )}
            </Fragment>
            <Fragment>
              {highlightedEvent && (
                <TimebarHighlighter
                  hoverStart={highlightedEvent.start}
                  hoverEnd={highlightedEvent.end}
                />
              )}
            </Fragment>
          </Fragment>
        </Timebar>
      </div>
      <div className={styles.filtersContainer}>
        {filterMode === Field.speed && (
          <div className={styles.rangeSliderContainer}>
            <Slider
              range
              min={rangeLimits.speed.min}
              max={rangeLimits.speed.max}
              step={0.1}
              vertical
              onChangeComplete={handleSpeedChange}
              allowCross={false}
              defaultValue={[minSpeed, maxSpeed]}
            />
            <div className={styles.rangeSliderValuesContainer}>
              <p>{`${maxSpeed} kt`}</p>
              <p>{`${minSpeed} kt`}</p>
            </div>
          </div>
        )}
        {filterMode === Field.timestamp && (
          <div className={styles.rangeSliderContainer}>
            <Slider
              range
              min={rangeLimits.hours.min}
              max={rangeLimits.hours.max}
              step={1}
              vertical
              onChangeComplete={handleTimeChange}
              allowCross={false}
              defaultValue={[fromHour, toHour]}
            />
            <div className={styles.rangeSliderValuesContainer}>
              <p>{`${toHour} hs`}</p>
              <p>{`${fromHour} hs`}</p>
            </div>
          </div>
        )}
        {filterMode === Field.elevation && (
          <div className={styles.rangeSliderContainer}>
            <Slider
              range
              min={rangeLimits.elevation.min}
              max={rangeLimits.elevation.max}
              step={1}
              vertical
              onChangeComplete={handleElevationChange}
              allowCross={false}
              defaultValue={[minElevation, maxElevation]}
            />
            <div className={styles.rangeSliderValuesContainer}>
              <p>{`${maxElevation} m`}</p>
              <p>{`${minElevation} m`}</p>
            </div>
          </div>
        )}
        {filterMode === Field.distanceFromPort && (
          <div className={styles.rangeSliderContainer}>
            <Slider
              range
              min={rangeLimits.distanceFromPort.min}
              max={rangeLimits.distanceFromPort.max}
              step={1}
              vertical
              onChangeComplete={handleDistanceFromPortChange}
              allowCross={false}
              defaultValue={[minDistanceFromPort, maxDistanceFromPort]}
            />
            <div className={styles.rangeSliderValuesContainer}>
              <p>{`${minDistanceFromPort} mt`}</p>
              <p>{`${maxDistanceFromPort} mt`}</p>
            </div>
          </div>
        )}
        <TimebarSelector />
      </div>
    </Fragment>
  )
}

export default memo(TimebarWrapper)
