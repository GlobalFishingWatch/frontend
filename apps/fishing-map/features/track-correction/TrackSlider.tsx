import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Slider, SliderOutput, SliderThumb, SliderTrack } from 'react-aria-components'
import { useTranslation } from 'react-i18next'
import { scaleLinear } from 'd3-scale'
import { throttle } from 'es-toolkit'
import { DateTime } from 'luxon'

import type { TrackSegment } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms'

import { useAppDispatch } from 'features/app/app.hooks'
import I18nDate from 'features/i18n/i18nDate'
import { disableHighlightedTime, setHighlightedTime } from 'features/timebar/timebar.slice'

// import './TrackSlider.css'
import styles from './TrackSlider.module.css'

type SegmentsTimelineProps = TrackSliderProps & {
  width?: number
  height?: number
  highlightColor?: string
  startTime?: number
  endTime?: number
}

const smallPointSize = 3
const largePointSize = 5
const smallPointOffset = (largePointSize - smallPointSize) / 2

function TrackSegmentsTimeline({
  segments,
  color = '#163f89',
  width = 400,
  height = 24,
  startTime,
  endTime,
}: SegmentsTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!segments?.length || !canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)
    const timestamps = segments
      .flat()
      .flatMap((segment) => segment.timestamp || [])
      .sort()

    const minTimestamp = timestamps[0]
    const maxTimestamp = timestamps[timestamps.length - 1]

    if (!timestamps.length || !minTimestamp || !maxTimestamp) return

    const xScale = scaleLinear()
      .domain([minTimestamp, maxTimestamp])
      .range([8, width - 8])
    ctx.fillStyle = color

    timestamps.forEach((timestamp) => {
      const x = xScale(timestamp || minTimestamp)
      const isInRange = startTime && endTime ? timestamp >= startTime && timestamp <= endTime : true
      const pointSize = isInRange ? largePointSize : smallPointSize
      ctx.beginPath()
      ctx.arc(x, height / 2 + (isInRange ? smallPointOffset : 0), pointSize, 0, 2 * Math.PI)
      ctx.globalAlpha = isInRange ? 1 : 0.4
      ctx.fillStyle = isInRange ? '#fff' : color
      ctx.strokeStyle = color
      ctx.fill()
      ctx.stroke()
    })

    // Renders an horizontal line below the points
    // ctx.save()
    // ctx.beginPath()
    // ctx.strokeStyle = color
    // ctx.lineWidth = 1
    // const lineY = height / 2
    // ctx.moveTo(8, lineY)
    // ctx.lineTo(width - 8, lineY)
    // ctx.stroke()
    // ctx.restore()
  }, [color, startTime, endTime, height, segments, width])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={styles.segmentsTimeline}
      aria-label="Track timeline"
    />
  )
}

type TrackSliderProps = {
  segments?: TrackSegment[]
  color?: string
}
function TrackSlider({ segments, color = '#163f89' }: TrackSliderProps) {
  const { t } = useTranslation()
  const initialPoint = segments?.[0]?.[0]
  const finalPoint = segments?.[segments.length - 1]?.[segments[segments.length - 1].length - 1]
  const [value, setValue] = useState([initialPoint?.timestamp || 0, finalPoint?.timestamp || 0])
  const dispatch = useAppDispatch()

  const throttledHighlightTime = useMemo(
    () =>
      throttle(({ start, end }: { start: string; end: string }) => {
        dispatch(setHighlightedTime({ start, end }))
      }, 300),
    [dispatch]
  )

  useEffect(() => {
    if (segments?.length) {
      setValue([initialPoint?.timestamp || 0, finalPoint?.timestamp || 0])
    }
    return () => {
      dispatch(disableHighlightedTime())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalPoint?.timestamp, initialPoint?.timestamp])

  const onSliderChange = useCallback(
    (value: number[]) => {
      setValue(value)
      const start = getUTCDateTime(value[0]).toISO()
      const end = getUTCDateTime(value[1]).toISO()
      if (start && end) {
        throttledHighlightTime({ start, end })
      }
    },
    [throttledHighlightTime]
  )

  if (!segments?.length) return null

  return (
    <Fragment>
      <Slider
        value={value}
        minValue={initialPoint?.timestamp || 0}
        maxValue={finalPoint?.timestamp || 100}
        step={1}
        onChange={onSliderChange}
        className={styles.slider}
      >
        <div>
          <label>{t('common.timeRange', 'Time range')}</label>
          <SliderOutput className={styles.sliderOutput}>
            {({ state }) => {
              return (
                <Fragment>
                  <I18nDate date={state.getThumbValue(0)} format={DateTime.DATETIME_MED} />
                  {' - '}
                  <I18nDate date={state.getThumbValue(1)} format={DateTime.DATETIME_MED} />
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
                  startTime={state.getThumbValue(0)}
                  endTime={state.getThumbValue(1)}
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
    </Fragment>
  )
}

export default TrackSlider
