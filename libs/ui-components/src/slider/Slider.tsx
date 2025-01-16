import React, { useCallback, useMemo, useState } from 'react'
import { getTrackBackground,Range } from 'react-range'
import cx from 'classnames'
import { format } from 'd3-format'
import { scaleLinear } from 'd3-scale'

import styles from './slider.module.css'

export type SliderThumbsSize = 'default' | 'small' | 'mini'
type SliderConfig = {
  // step: number
  steps: number[]
  min: number
  max: number
}
interface SliderProps {
  label: string
  thumbsSize?: SliderThumbsSize
  initialValue: number
  config: SliderConfig
  onChange: (value: number) => void
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

export const formatSliderNumber = (num: number): string => {
  const absNum = Math.abs(num)
  if (absNum >= 1000) return format('.2s')(num)
  if (absNum > 9) return format('.0f')(num)
  return format('.1f')(num)
}

export function Slider(props: SliderProps) {
  const { initialValue, label, config = {}, onChange, className, thumbsSize = 'default' } = props
  const { min = MIN, max = MAX, steps } = config as SliderConfig
  const scale = useMemo(() => {
    return scaleLinear()
      .domain(steps.map((_, i) => (MAX / (steps.length - 1)) * i))
      .range(steps)
      .nice()
  }, [steps])

  const initialValueScaled = [scale.invert(initialValue)]
  const [values, setValues] = useState(initialValueScaled)

  const handleChange = useCallback(
    (values: number[]) => {
      setValues(values)
    },
    [setValues]
  )
  const handleFinalChange = useCallback(
    (values: number[]) => {
      onChange(scale(values[0]))
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
              role="button"
              tabIndex={0}
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
            const { key, ...rest } = props
            const value = values[index]
            const scaledValue = scale(value)
            const isDefaultSelection = index === 0 ? value === min : value === max
            return (
              <div
                key={key}
                {...rest}
                className={cx(styles.sliderThumb, styles[`${thumbsSize}Size`])}
                style={{
                  ...props.style,
                }}
              >
                {thumbsSize !== 'mini' && (
                  <span
                    className={styles.sliderThumbCounter}
                    style={{ opacity: isDefaultSelection ? 0.7 : 1 }}
                  >
                    {formatSliderNumber(scaledValue)}
                  </span>
                )}
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}
