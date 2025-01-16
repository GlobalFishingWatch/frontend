import { useCallback, useEffect,useMemo, useState } from 'react'
import { getTrackBackground,Range } from 'react-range'
import cx from 'classnames'

import { IconButton } from '../icon-button'
import { InputText } from '../input-text'
import type { SliderThumbsSize } from '../slider'
import { formatSliderNumber } from '../slider'

import styles from '../slider/slider.module.css'

export type SliderRangeValues = number[]
type SliderRangeConfig = {
  steps: number[]
  min: number
  max: number
}
interface SliderRangeProps {
  label: string
  thumbsSize?: SliderThumbsSize
  initialRange: SliderRangeValues
  range?: SliderRangeValues
  config: SliderRangeConfig
  onChange: (range: SliderRangeValues) => void
  onCleanClick?: (e: React.MouseEvent) => void
  className?: string
  //static for now for the VIIRS release
  histogram?: boolean
  showInputs?: boolean
}
type Precision = 'high' | 'mid' | 'low'

const MIN = 0
const MAX = 200

const CONFIG_BY_PRECISION: Record<Precision, { step: number; round: (v: number) => number }> = {
  high: {
    step: 0.01,
    round: (v) => Math.round(v * 100) / 100,
  },
  mid: {
    step: 0.1,
    round: (v) => Math.round(v * 10) / 10,
  },
  low: {
    step: 1,
    round: (v) => Math.round(v),
  },
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

export function SliderRange(props: SliderRangeProps) {
  const {
    initialRange,
    range,
    label,
    config = {},
    onChange,
    onCleanClick,
    className,
    histogram,
    thumbsSize = 'default',
    showInputs = false,
  } = props
  const { min = MIN, max = MAX } = config as SliderRangeConfig
  const precisionConfig =
    CONFIG_BY_PRECISION[max - min >= 100 ? 'low' : max - min >= 10 ? 'mid' : 'high']
  const initialValues = initialRange || [min, max]
  const [internalValues, setInternalValues] = useState(initialValues)

  useEffect(() => {
    if (range?.length) {
      setInternalValues(range)
    }
  }, [range])

  const handleChange = useCallback(
    (values: SliderRangeValues) => {
      if (values[1] > values[0]) {
        setInternalValues(values.map((v) => precisionConfig.round(v)))
      }
    },
    [precisionConfig]
  )

  const onInitialRangeInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const initialRange = precisionConfig.round(parseFloat(e.target.value))
      if (initialRange >= min && initialRange < internalValues[1]) {
        setInternalValues([initialRange, internalValues[1]])
        onChange([initialRange, internalValues[1]])
      }
    },
    [internalValues, min, onChange, precisionConfig]
  )
  const onFinalRangeInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const finalRange = precisionConfig.round(parseFloat(e.target.value))
      if (finalRange <= max && internalValues[0] < finalRange) {
        setInternalValues([internalValues[0], finalRange])
        onChange([internalValues[0], finalRange])
      }
    },
    [internalValues, max, onChange, precisionConfig]
  )

  const handleFinalChange = useCallback(
    (values: SliderRangeValues) => {
      onChange(values)
    },
    [onChange]
  )

  const background = useMemo(
    () =>
      getTrackBackground({
        min: min,
        max: max,
        values: internalValues,
        colors: [borderColor, activeColor, borderColor],
      }),
    [internalValues, max, min]
  )

  const areDefaultValues = internalValues[0] === min && internalValues[1] === max
  return (
    <div className={className}>
      {label && (
        <label className={styles.label}>
          {label}
          {onCleanClick && !areDefaultValues && (
            <IconButton size="small" icon="delete" onClick={onCleanClick} />
          )}
        </label>
      )}
      <div className={styles.container}>
        {histogram && (
          <svg
            className={styles.histogram}
            xmlns="http://www.w3.org/2000/svg"
            width="262"
            height="25"
          >
            <g fill="#163F89" fillRule="evenodd" opacity=".2">
              <path d="M0 24h7.4v1H0zM9.51 24h7.4v1h-7.4zM19.01 24h7.4v1h-7.4zM28.52 23.95h7.4v1h-7.4zM38.02 17.96h7.4v6.99h-7.4zM47.53 6.99h7.4v17.96h-7.4zM57.03 2.99h7.4v21.96h-7.4zM66.54 1h7.4v23.95h-7.4zM76.04 0h7.4v24.95h-7.4zM85.55 0h7.4v24.95h-7.4zM95.05 1h7.4v23.95h-7.4zM104.56 2.99h7.4v21.96h-7.4zM114.06 3.99h7.4v20.96h-7.4zM123.57 5.99h7.4v18.96h-7.4zM133.07 9.98h7.4v14.97h-7.4zM142.58 12.97h7.4v11.98h-7.4zM152.08 16.97h7.4v7.98h-7.4zM161.59 19.96h7.4v4.99h-7.4zM171.09 20.96h7.4v3.99h-7.4zM180.6 21.96h7.4v2.99h-7.4zM190.1 21.96h7.4v2.99h-7.4zM199.61 22.95h7.4v2h-7.4zM209.11 22.95h7.4v2h-7.4zM218.62 23.95h7.4v1h-7.4zM228.12 24h7.4v1h-7.4zM237.63 24h7.4v1h-7.4zM247.13 24h7.4v1h-7.4zM256.64 24h7.4v1h-7.4z" />
            </g>
          </svg>
        )}
        <Range
          values={internalValues}
          step={precisionConfig.step}
          min={min}
          max={max}
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
            const value = internalValues[index]
            const isDefaultSelection = index === 0 ? value === min : value === max
            return (
              <div
                {...props}
                key={props.key}
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
                    {formatSliderNumber(value)}
                  </span>
                )}
              </div>
            )
          }}
        />
      </div>
      {showInputs && (
        <div className={styles.rangeContainerInputs}>
          <InputText
            value={internalValues?.[0]}
            step={precisionConfig.step.toString()}
            onChange={onInitialRangeInputChange}
            type="number"
          />
          <InputText
            value={internalValues?.[1]}
            step={precisionConfig.step.toString()}
            onChange={onFinalRangeInputChange}
            type="number"
          />
        </div>
      )}
    </div>
  )
}
