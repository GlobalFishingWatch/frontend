import React, { useMemo, useCallback, useState } from 'react'
import { Range, getTrackBackground } from 'react-range'
import { format } from 'd3-format'
import { scaleLinear } from 'd3-scale'
import styles from './slider.module.css'

export type SliderRange = number[]
type SliderConfig = {
  // step: number
  steps: number[]
  min: number
  max: number
}
interface SliderProps {
  label: string
  initialRange: SliderRange
  config: SliderConfig
  onChange: (range: SliderRange) => void
  className?: string
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

export const formatNumber = (num: number): string => {
  if (num >= 1000) return format('.2s')(num)
  if (num > 9) return format('.0f')(num)
  if (num >= 1) return format('.1')(num)
  return format('.1f')(num)
}

export function Slider(props: SliderProps) {
  const { initialRange, label, config = {}, onChange, className } = props
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
                className={styles.sliderThumb}
                style={{
                  ...props.style,
                }}
              >
                <span
                  className={styles.sliderThumbCounter}
                  style={{ opacity: isDefaultSelection ? 0.7 : 1 }}
                >
                  {formatNumber(scaledValue)}
                </span>
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}
