import { useCallback, useMemo, useState } from 'react'
import { Slider as AriaSlider, SliderThumb, SliderTrack } from 'react-aria-components/Slider'
import cx from 'classnames'
import { scaleLinear } from 'd3-scale'

import { formatSliderNumber, getSliderTrackBackground } from './slider.utils'

import styles from './slider.module.css'

export type SliderThumbsSize = 'default' | 'small' | 'mini'
type SliderConfig = {
  step?: number
  steps: number[]
  min: number
  max: number
}
interface SliderProps {
  label: string
  operationLabel?: string
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

export function Slider(props: SliderProps) {
  const {
    initialValue,
    label,
    operationLabel = '',
    config = {},
    onChange,
    className,
    thumbsSize = 'default',
  } = props
  const { min = MIN, max = MAX, steps, step = STEP } = config as SliderConfig
  const scale = useMemo(() => {
    return scaleLinear()
      .domain(steps.map((_, i) => (max / (steps.length - 1)) * i))
      .range(steps)
      .nice()
      .clamp(true)
  }, [max, steps])

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

  const rangeMin = Math.min(min, 0)
  const rangeMax = Math.max(min, max)

  const background = useMemo(
    () =>
      getSliderTrackBackground({
        min: rangeMin,
        max: rangeMax,
        values,
        colors: [borderColor, activeColor, borderColor],
      }),
    [values]
  )

  return (
    <div className={className}>
      <label>{label}</label>
      <div className={styles.container}>
        <AriaSlider
          className={styles.slider}
          aria-label={label}
          value={values}
          minValue={rangeMin}
          maxValue={rangeMax}
          step={step}
          onChange={(value) => handleChange(Array.isArray(value) ? value : [value])}
          onChangeEnd={(value) => handleFinalChange(Array.isArray(value) ? value : [value])}
        >
          <SliderTrack className={styles.sliderTrack} style={{ background }}>
            {({ state }) => {
              const value = state.getThumbValue(0)
              const isDefaultSelection = value === min
              return (
                <SliderThumb
                  index={0}
                  className={cx(styles.sliderThumb, styles[`${thumbsSize}Size`])}
                >
                  {thumbsSize !== 'mini' && (
                    <span
                      className={styles.sliderThumbCounter}
                      style={{ opacity: isDefaultSelection ? 0.7 : 1 }}
                    >
                      {`${operationLabel}${formatSliderNumber(scale(value))}`}
                    </span>
                  )}
                </SliderThumb>
              )
            }}
          </SliderTrack>
        </AriaSlider>
      </div>
    </div>
  )
}
