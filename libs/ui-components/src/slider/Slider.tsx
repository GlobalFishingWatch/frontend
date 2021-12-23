import React, { useMemo, useCallback } from 'react'
import { Range, getTrackBackground } from 'react-range'
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
}

const activeColor =
  getComputedStyle(document.body).getPropertyValue('---color-primary-blue') ||
  'rgba(22, 63, 137, 1)'
const borderColor =
  getComputedStyle(document.body).getPropertyValue('--color-border') || 'rgba(22, 63, 137, 0.15)'

export function Slider(props: SliderProps) {
  const { range, label, config = {}, onChange } = props
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
    <div>
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
                  {value}
                </span>
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}
