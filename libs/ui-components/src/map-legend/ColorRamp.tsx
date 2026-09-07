import React, { Fragment, useCallback, useMemo } from 'react'
import cx from 'classnames'
import { scaleLinear } from 'd3-scale'

import type { ColorRampBrushConfig } from './ColorRampBrush'
import { ColorRampBrush } from './ColorRampBrush'
import {
  formatLegendValue,
  parseLegendNumber,
  roundLegendDecimals,
  roundLegendNumber,
  SCIENTIFIC_NOTATION_E,
} from './map-legend.utils'
import type { UILegendColorRamp } from './types'

import styles from './MapLegend.module.css'

type PercentScale = ((value: number) => number) | null

const toPercent = (scale: PercentScale, value: number) => {
  const scaled = scale?.(value) as number
  return isNaN(scaled) || scaled < 0 ? 0 : scaled
}

type ColorRampLegendProps = {
  layer: UILegendColorRamp
  className?: string
  roundValues?: boolean
  currentValueClassName?: string
  labelComponent?: React.ReactNode
  brush?: ColorRampBrushConfig
}

export function ColorRampLegend({
  layer = {} as UILegendColorRamp,
  className = '',
  roundValues = true,
  currentValueClassName = '',
  labelComponent = null,
  brush,
}: ColorRampLegendProps) {
  const { gridArea, values, colors, loading, label, unit, currentValue, type, gradient } = layer
  // Omit bucket that goes from -Infinity --> 0 on non-divergent scales.
  const omitFirstBucket = !layer.divergent

  const domainValues = useMemo(
    () => (omitFirstBucket ? values?.slice(1) : values),
    [omitFirstBucket, values]
  )
  const cleanValues = values?.filter((value) => value)
  const skipOddLabels = cleanValues && cleanValues.length >= 6 && !layer.divergent

  const stepPercents = useMemo(() => {
    if (!domainValues?.length) return []
    const isDiscrete = type === 'colorramp-discrete' && !!colors?.length
    return domainValues.map((_, i) =>
      isDiscrete ? ((i + 1) * 100) / colors.length : (i * 100) / domainValues.length
    )
  }, [domainValues, colors, type])

  const rampScale = useMemo(() => {
    if (!domainValues?.length || !stepPercents.length) return null

    // Reuse d3 logic when values go beyond max value
    const adjustedDomain = [...domainValues] as number[]
    if (adjustedDomain[0] === -Infinity) {
      adjustedDomain[0] = adjustedDomain[1] + adjustedDomain[2]
    }
    return scaleLinear().domain(adjustedDomain).range(stepPercents)
  }, [domainValues, stepPercents])

  const valueToPercent = useCallback((value: number) => toPercent(rampScale, value), [rampScale])

  const brushScale = useMemo(() => {
    if (!rampScale) return null
    const range = rampScale.range() as number[]
    if (range[0] === 0) return rampScale
    const firstValue = values?.[0] as number
    const floor = omitFirstBucket && Number.isFinite(firstValue) ? firstValue : 0
    return scaleLinear()
      .domain([floor, ...(rampScale.domain() as number[])])
      .range([0, ...range])
  }, [rampScale, omitFirstBucket, values])

  const brushValueToPercent = useCallback(
    (value: number) => toPercent(brushScale, value),
    [brushScale]
  )

  const percentToValue = useCallback(
    (percent: number) => {
      const value = brushScale?.invert(percent) as number
      return isNaN(value) ? 0 : value
    },
    [brushScale]
  )

  const backgroundStyle = useMemo(() => {
    if (!colors?.length) return {}
    if (type !== 'colorramp-discrete') {
      return {
        backgroundImage: `linear-gradient(to right, ${colors?.map((color) => color).join()})`,
      }
    }
    if (!gradient) return {}
    const stops = colors.map((color, i) => `${color} ${(i * 100) / colors.length}%`)
    return {
      backgroundImage: `linear-gradient(to right, ${[...stops, `${colors[colors.length - 1]} 100%`].join()})`,
    }
  }, [colors, type, gradient])

  const Label = labelComponent ? (
    labelComponent
  ) : (
    <p>
      {label && label}
      {unit && (
        <span className={styles.subTitle}>
          {' '}
          ({unit}
          {gridArea && <span> / {gridArea}</span>})
        </span>
      )}
    </p>
  )

  if (loading && colors && type === 'colorramp-discrete') {
    return (
      <div className={cx(styles.row, className)}>
        {Label}
        <div className={styles.ramp} style={backgroundStyle}>
          <div className={styles.discreteSteps}>
            {colors.map((color: string, i: number) =>
              i > 0 ? (
                <span className={styles.discreteStep} key={i} style={{ backgroundColor: color }} />
              ) : null
            )}
          </div>
        </div>
        <div className={cx(styles.stepsContainer)}>
          {colors.map((_: string, i: number) => {
            if (skipOddLabels && i !== 0 && i !== domainValues?.length && i % 2 === 1) return null
            return (
              <span
                className={cx(styles.step, {
                  [styles.lastStep]: !skipOddLabels && i === colors.length - 1,
                })}
                style={{ left: `${(i * 100) / (colors.length - 1)}%` }}
                key={i}
              >
                <span className={styles.loading}>
                  <span>·</span>
                  <span>·</span>
                  <span>·</span>
                </span>
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  if (!domainValues || !colors?.length) {
    return null
  }

  const getValueLabel = (valueLabel: string) => {
    if (!valueLabel.includes(SCIENTIFIC_NOTATION_E)) return valueLabel
    const numParts = valueLabel.split(SCIENTIFIC_NOTATION_E)
    return (
      <span>
        {numParts[0]}
        {SCIENTIFIC_NOTATION_E}
        <sup className={styles.sup}>{numParts[1]}</sup>
      </span>
    )
  }

  return (
    <div className={cx(styles.row, className)}>
      {Label}
      {domainValues?.length > 0 && (
        <Fragment>
          <div className={styles.ramp} style={backgroundStyle}>
            {currentValue !== null && currentValue !== undefined && rampScale && (
              <span
                className={cx(styles.currentValue, currentValueClassName, {
                  [styles.offsetLeft]: valueToPercent(currentValue as number) < 10,
                  [styles.offsetRight]: valueToPercent(currentValue as number) > 90,
                })}
                style={{
                  left: `${Math.min(valueToPercent(currentValue as number), 100)}%`,
                }}
              >
                {formatLegendValue({
                  number: currentValue as number,
                  roundValues,
                  isFirst: false,
                  isLast: false,
                  divergent: layer.divergent,
                })}
              </span>
            )}
            {type === 'colorramp-discrete' && !gradient && (
              <div className={styles.discreteSteps}>
                {colors.map((color, i) => (
                  <span
                    className={styles.discreteStep}
                    key={i}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
            {brush && rampScale && !layer.divergent && (
              <ColorRampBrush
                unit={unit}
                {...brush}
                valueToPercent={brushValueToPercent}
                percentToValue={percentToValue}
                formatValue={(value) => formatLegendValue({ number: value, roundValues }) as string}
                roundValue={roundValues ? roundLegendNumber : roundLegendDecimals}
              />
            )}
          </div>
          <div className={styles.stepsContainer}>
            {domainValues.map((value, i) => {
              if (value === null || value === undefined || value === -Infinity) return null
              const roundValue = roundValues
                ? roundLegendNumber(value as number)
                : parseLegendNumber(value as number)
              const valueLabel =
                typeof value === 'string'
                  ? value
                  : formatLegendValue({
                      number: roundValue,
                      roundValues,
                      isFirst: (omitFirstBucket && i === 0) || (!omitFirstBucket && i === 1),
                      isLast: i === domainValues.length - 1,
                      divergent: layer.divergent,
                    })

              if (skipOddLabels && i !== 0 && i !== values?.length && i % 2 === 1) return null
              return (
                <span
                  className={cx(styles.step, {
                    [styles.firstStep]: omitFirstBucket && i === 0,
                    [styles.lastStep]:
                      !skipOddLabels && !layer.divergent && i === domainValues.length - 1,
                  })}
                  style={{ left: `${stepPercents[i]}%` }}
                  key={i}
                >
                  {getValueLabel(valueLabel)}
                </span>
              )
            })}
          </div>
        </Fragment>
      )}
    </div>
  )
}
