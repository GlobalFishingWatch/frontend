import React, { useMemo, useCallback, useState } from 'react'
import cx from 'classnames'
import { Range, getTrackBackground } from 'react-range'
import { format } from 'd3-format'
import { scaleLinear } from 'd3-scale'
import styles from './slider.module.css'

export type SliderRange = number[]
export type SliderThumbsSize = 'default' | 'small'
type SliderConfig = {
  // step: number
  steps: number[]
  min: number
  max: number
}
interface SliderProps {
  label: string
  thumbsSize?: SliderThumbsSize
  initialRange: SliderRange
  config: SliderConfig
  onChange: (range: SliderRange) => void
  className?: string
  //static for now for the VIIRS release
  histogram?: boolean
}

const MIN = 0
const MAX = 200
const STEP = 1

const fallbackActiveColor = 'rgba(22, 63, 137, 1)'
const fallbackBorderColor = 'rgba(22, 63, 137, 0.15)'
const activeColor =
  typeof window !== 'undefined'
    ? getComputedStyle(document.body).getPropertyValue('---color-primary-blue') ||
      fallbackActiveColor
    : fallbackActiveColor
const borderColor =
  typeof window !== 'undefined'
    ? getComputedStyle(document.body).getPropertyValue('--color-border') || fallbackBorderColor
    : fallbackBorderColor

export const formatSliderNumber = (num: number): string => {
  if (num >= 1000) return format('.2s')(num)
  if (num > 9) return format('.0f')(num)
  return format('.1f')(num)
}

export function Slider(props: SliderProps) {
  const {
    initialRange,
    label,
    config = {},
    onChange,
    className,
    histogram,
    thumbsSize = 'default',
  } = props
  const { min = MIN, max = MAX, steps } = config as SliderConfig
  const scale = useMemo(() => {
    return scaleLinear()
      .domain(steps.map((_, i) => (MAX / (steps.length - 1)) * i))
      .range(steps)
      .nice()
  }, [steps])

  const initialValues = (initialRange || [min, max]).map((v) => scale.invert(v))
  const [values, setValues] = useState(initialValues)

  const handleChange = useCallback(
    (values: SliderRange) => {
      if (values[1] > values[0]) {
        setValues(values)
      }
    },
    [setValues]
  )
  const handleFinalChange = useCallback(
    (values: SliderRange) => {
      onChange([scale(values[0]), scale(values[1])])
    },
    [onChange, scale]
  )

  const background = useMemo(
    () =>
      getTrackBackground({
        min: MIN,
        max: MAX,
        values,
        colors: [borderColor, activeColor, borderColor],
      }),
    [values]
  )

  return (
    <div className={className}>
      <label>{label}</label>
      <div className={styles.container}>
        {histogram && (
          <svg
            className={styles.histogram}
            xmlns="http://www.w3.org/2000/svg"
            width="262"
            height="25"
          >
            <g fill="#163F89" fill-rule="evenodd" opacity=".2">
              <path d="M0 24h7.4v1H0zM9.51 24h7.4v1h-7.4zM19.01 24h7.4v1h-7.4zM28.52 23.95h7.4v1h-7.4zM38.02 17.96h7.4v6.99h-7.4zM47.53 6.99h7.4v17.96h-7.4zM57.03 2.99h7.4v21.96h-7.4zM66.54 1h7.4v23.95h-7.4zM76.04 0h7.4v24.95h-7.4zM85.55 0h7.4v24.95h-7.4zM95.05 1h7.4v23.95h-7.4zM104.56 2.99h7.4v21.96h-7.4zM114.06 3.99h7.4v20.96h-7.4zM123.57 5.99h7.4v18.96h-7.4zM133.07 9.98h7.4v14.97h-7.4zM142.58 12.97h7.4v11.98h-7.4zM152.08 16.97h7.4v7.98h-7.4zM161.59 19.96h7.4v4.99h-7.4zM171.09 20.96h7.4v3.99h-7.4zM180.6 21.96h7.4v2.99h-7.4zM190.1 21.96h7.4v2.99h-7.4zM199.61 22.95h7.4v2h-7.4zM209.11 22.95h7.4v2h-7.4zM218.62 23.95h7.4v1h-7.4zM228.12 24h7.4v1h-7.4zM237.63 24h7.4v1h-7.4zM247.13 24h7.4v1h-7.4zM256.64 24h7.4v1h-7.4z" />
            </g>
          </svg>
        )}
        <Range
          values={values}
          step={STEP}
          min={MIN}
          max={MAX}
          onChange={handleChange}
          onFinalChange={handleFinalChange}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              className={styles.slider}
              style={props.style}
            >
              <div ref={props.ref} className={styles.sliderTrack} style={{ background }}>
                {children}
              </div>
            </div>
          )}
          renderThumb={({ index, props }) => {
            const value = values[index]
            const scaledValue = scale(value)
            const isDefaultSelection = index === 0 ? value === min : value === max
            return (
              <div
                {...props}
                className={cx(styles.sliderThumb, styles[`${thumbsSize}Size`])}
                style={{
                  ...props.style,
                }}
              >
                <span
                  className={styles.sliderThumbCounter}
                  style={{ opacity: isDefaultSelection ? 0.7 : 1 }}
                >
                  {formatSliderNumber(scaledValue)}
                </span>
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}
