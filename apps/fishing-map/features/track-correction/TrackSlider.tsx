import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react'
import { Slider, SliderOutput, SliderThumb, SliderTrack } from 'react-aria-components'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { scaleLinear } from 'd3-scale'
import { throttle } from 'es-toolkit'
import { DateTime } from 'luxon'

import type { TrackPoint, TrackSegment } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms'

import { useAppDispatch } from 'features/app/app.hooks'
import I18nDate from 'features/i18n/i18nDate'
import { disableHighlightedTime, setHighlightedTime } from 'features/timebar/timebar.slice'
import {
  selectTrackCorrectionTimerange,
  setTrackCorrectionTimerange,
} from 'features/track-correction/track-correction.slice'

// import './TrackSlider.css'
import styles from './TrackSlider.module.css'

type SegmentsTimelineProps = Omit<TrackSliderProps, 'onTimerangeChange'> & {
  color?: string
  width?: number
  height?: number
  selectedStartTime?: number
  selectedEndTime?: number
}

function TrackSegmentsTimeline({
  segments,
  color = '#163f89',
  width = 333,
  height = 30,
  rangeStartTime,
  rangeEndTime,
  selectedStartTime,
  selectedEndTime,
}: SegmentsTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!segments?.length || !canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const scale = 2
    const scaledWidth = width * scale
    const scaledHeight = height * scale
    ctx.clearRect(0, 0, scaledWidth, scaledHeight)

    const xScale = scaleLinear().domain([rangeStartTime, rangeEndTime]).range([0, scaledWidth])

    const pointSize = 2 * scale
    const lineWidth = 1 * scale
    const centerY = scaledHeight / 2 + 1
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth

    segments.forEach((segment) => {
      const segmentStart = segment[0].timestamp
      const segmentEnd = segment[segment.length - 1].timestamp
      if (!segmentStart || !segmentEnd) return
      ctx.beginPath()
      ctx.moveTo(xScale(segmentStart), centerY)
      ctx.lineTo(xScale(segmentEnd), centerY)
      ctx.stroke()
      segment.forEach((point) => {
        const timestamp = point.timestamp
        if (!timestamp) return
        ctx.beginPath()
        const isInRange =
          selectedStartTime && selectedEndTime
            ? timestamp >= selectedStartTime && timestamp <= selectedEndTime
            : true
        ctx.arc(xScale(timestamp), centerY, pointSize, 0, 2 * Math.PI)
        ctx.fillStyle = isInRange ? '#fff' : color
        ctx.fill()
        if (isInRange) {
          ctx.stroke()
        }
      })
    })
  }, [
    color,
    selectedStartTime,
    selectedEndTime,
    segments,
    rangeStartTime,
    rangeEndTime,
    width,
    height,
  ])

  return (
    <canvas
      ref={canvasRef}
      width={width * 2}
      height={height * 2}
      className={styles.segmentsTimeline}
      aria-label="Track timeline"
    />
  )
}

type TrackSliderProps = {
  segments?: TrackSegment[]
  color?: string
  rangeStartTime: number
  rangeEndTime: number
  onTimerangeChange: (start: number, end: number) => void
}

function TrackSlider({
  segments,
  color = '#163f89',
  rangeStartTime,
  rangeEndTime,
  onTimerangeChange,
}: TrackSliderProps) {
  const { t } = useTranslation()
  const allPoints = segments?.flatMap((segment) => segment)
  const initialPoint = allPoints?.[0]
  const finalPoint = allPoints?.[allPoints.length - 1]
  const { start, end } = useSelector(selectTrackCorrectionTimerange)
  const dispatch = useAppDispatch()
  const startTime = getUTCDateTime(start).toMillis()
  const endTime = getUTCDateTime(end).toMillis()

  useEffect(() => {
    if (!start || !end) {
      dispatch(
        setTrackCorrectionTimerange({
          start: getUTCDateTime(rangeStartTime!).toISO() ?? start,
          end: getUTCDateTime(rangeEndTime!).toISO() ?? end,
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, rangeStartTime, rangeEndTime])

  const throttledHighlightTime = useMemo(
    () =>
      throttle(({ start, end }: { start: string; end: string }) => {
        dispatch(setTrackCorrectionTimerange({ start, end }))
      }, 300),
    [dispatch]
  )

  const findNearestPoint = useCallback(
    (date: DateTime) => {
      let minTimeDelta = Infinity
      let nearestDate: DateTime | null = null
      allPoints?.forEach((point) => {
        const pointDate = getUTCDateTime(point.timestamp as number)
        const delta = Math.abs(pointDate.diff(date).toMillis())
        if (delta < minTimeDelta) {
          minTimeDelta = delta
          nearestDate = pointDate
        }
      })
      return nearestDate as DateTime | null
    },
    [allPoints]
  )

  const onSliderChange = useCallback(
    (value: number[]) => {
      const start = findNearestPoint(getUTCDateTime(value[0]))
      const end = findNearestPoint(getUTCDateTime(value[1]))
      if (start && end) {
        dispatch(
          setTrackCorrectionTimerange({
            start: start.toISO() as string,
            end: end.toISO() as string,
          })
        )
        // throttledHighlightTime({ start: start.toISO() as string, end: end.toISO() as string })
        if (onTimerangeChange) {
          onTimerangeChange(start.toMillis(), end.toMillis())
        }
      }
    },
    [dispatch, findNearestPoint, onTimerangeChange]
  )

  if (!segments?.length || !initialPoint?.timestamp || !finalPoint?.timestamp) return null

  return (
    <Slider
      value={[startTime, endTime]}
      minValue={rangeStartTime}
      maxValue={rangeEndTime}
      step={1}
      onChange={onSliderChange}
      className={styles.slider}
      aria-label="Track slider"
    >
      <div>
        <SliderOutput className={styles.sliderOutput}>
          {({ state }) => {
            return (
              <Fragment>
                <I18nDate
                  date={state.getThumbValue(0)}
                  format={DateTime.DATETIME_MED}
                  showUTCLabel={false}
                />
                {' - '}
                <I18nDate
                  date={state.getThumbValue(1)}
                  format={DateTime.DATETIME_MED}
                  showUTCLabel={false}
                />
              </Fragment>
            )
          }}
        </SliderOutput>
      </div>
      <SliderTrack
        className={styles.sliderTrack}
        // style={{ '--sliderColor': color } as React.CSSProperties}
      >
        {({ state }) => {
          return (
            <Fragment>
              <TrackSegmentsTimeline
                segments={segments}
                color={color}
                rangeStartTime={rangeStartTime}
                rangeEndTime={rangeEndTime}
                selectedStartTime={state.getThumbValue(0)}
                selectedEndTime={state.getThumbValue(1)}
              />
              {state.values.map((_, i) => (
                <SliderThumb
                  key={i}
                  index={i}
                  aria-label={i === 0 ? 'start' : i === state.values.length - 1 ? 'end' : ''}
                  className={styles.sliderThumb}
                />
              ))}
            </Fragment>
          )
        }}
      </SliderTrack>
    </Slider>
  )
}

export default TrackSlider
