import {
    Fragment,
    useContext,
    useCallback,
    useMemo,
  } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TimelineContext } from '@globalfishingwatch/timebar'
  import {
    useSegmentsLabeledConnect,
  } from '../../features/timebar/timebar.hooks'
  import {
    selectColorMode,
    selectProjectColors,
    selectTimebarMode,
  } from '../../routes/routes.selectors'
import { VesselPoint } from '../../types'
import { selectedtracks } from '../../features/vessels/selectedTracks.slice'
import { Field } from '../../data/models'
import {
  setTooltip,
} from './timebar.slice'
import styles from './Timebar.module.css'
import {
    selectVesselDirectionPoints,
    selectVesselDirectionsMinMaxValues,
    selectVesselDirectionsPositionScale,
  } from './timebar.selectors'
  // This displays the positions of the vessel in the timebar styled by speed and adds the
// posibility of click them to select a segment
export const VesselEventsPointsGraph = () => {
    // TODO: Performance issue if we have lot of points
    const { outerScale, outerHeight } = useContext(TimelineContext)
    const timebarMode = useSelector(selectTimebarMode)
    const colorMode = useSelector(selectColorMode)
    const projectColors = useSelector(selectProjectColors)
    const vesselPoints = useSelector(selectVesselDirectionPoints)
    const { min: minValue, max: maxValue } = useSelector(selectVesselDirectionsMinMaxValues)
    const positionScale = useSelector(selectVesselDirectionsPositionScale)
   
  
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