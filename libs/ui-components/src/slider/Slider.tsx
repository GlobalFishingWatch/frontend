import React, { useMemo, useCallback } from 'react'
import { Range, getTrackBackground } from 'react-range'
import { format } from 'd3-format'
import styles from './slider.module.css'

export type SliderRange = number[]
type SliderConfig = {
  step: number
  min: number
  max: number
}
interface SliderProps {
  label: string
  range: SliderRange
  config?: SliderConfig
  onChange: (range: SliderRange) => void
  className?: string
}

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

export function Slider(props: SliderProps) {
  const { range, label, config = {}, onChange, className } = props
  const { step = 1, min = 0, max = 100 } = config as SliderConfig
  const values = useMemo(() => range || [min, max], [max, min, range])

  const handleChange = useCallback(
    (values: SliderRange) => {
      if (values[1] > values[0]) {
        onChange(values)
      }
    },
    [onChange]
  )

  const background = useMemo(
    () =>
      getTrackBackground({
        min,
        max,
        values,
        colors: [borderColor, activeColor, borderColor],
      }),
    [max, min, values]
  )

  return (
    <div className={className}>
      <label>{label}</label>
      <div className={styles.container}>
        <Range
          values={values}
          step={step}
          min={min}
          max={max}
          onChange={handleChange}
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
                  {`${format('~s')(value)}${value === max ? '+' : ''}`}
                </span>
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}
