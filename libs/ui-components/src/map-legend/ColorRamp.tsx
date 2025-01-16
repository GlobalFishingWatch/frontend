import React, { Fragment, useMemo } from 'react'
import cx from 'classnames'
import { scaleLinear } from 'd3-scale'

import {
  formatLegendValue,
  parseLegendNumber,
  roundLegendNumber,
  SCIENTIFIC_NOTATION_E,
} from './map-legend.utils'
import type { UILegendColorRamp } from './types'

import styles from './MapLegend.module.css'

type ColorRampLegendProps = {
  layer: UILegendColorRamp
  className?: string
  roundValues?: boolean
  currentValueClassName?: string
  labelComponent?: React.ReactNode
}

export function ColorRampLegend({
  layer = {} as UILegendColorRamp,
  className = '',
  roundValues = true,
  currentValueClassName = '',
  labelComponent = null,
}: ColorRampLegendProps) {
  const { gridArea, values, colors, loading, label, unit, currentValue, type } = layer
  // Omit bucket that goes from -Infinity --> 0 on non-divergent scales.
  const omitFirstBucket = !layer.divergent
  const domainValues = omitFirstBucket ? values?.slice(1) : values
  const cleanValues = values?.filter((value) => value)
  const skipOddLabels = cleanValues && cleanValues.length >= 6 && !layer.divergent

  // This scale is only used to draw non discrete gradient, and current value positioning
  const heatmapLegendScale = useMemo(() => {
    if (!values || !domainValues) return null

    // Reuse d3 logic when values go beyond max value
    if (domainValues[0] === -Infinity) {
      domainValues[0] = domainValues[1] + domainValues[2]
    }

    const rangeValues = domainValues.map((item, i) => (i * 100) / domainValues.length)

    return (value: number) => {
      const scaled = scaleLinear().range(rangeValues).domain(domainValues)(value)
      return isNaN(scaled) || scaled < 0 ? 0 : scaled
    }
  }, [domainValues, values])

  const backgroundStyle = useMemo(() => {
    if (!colors || type === 'colorramp-discrete') return {}
    return {
      backgroundImage: `linear-gradient(to right, ${colors?.map((color) => color).join()})`,
    }
  }, [colors, type])

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
            {currentValue !== null && currentValue !== undefined && heatmapLegendScale && (
              <span
                className={cx(styles.currentValue, currentValueClassName, {
                  [styles.offsetLeft]: heatmapLegendScale(currentValue as number) < 10,
                  [styles.offsetRight]: heatmapLegendScale(currentValue as number) > 90,
                })}
                style={{
                  left: `${Math.min(heatmapLegendScale(currentValue as number) as number, 100)}%`,
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
            {type === 'colorramp-discrete' && (
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
                  style={{ left: `${(i * 100) / domainValues.length}%` }}
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
