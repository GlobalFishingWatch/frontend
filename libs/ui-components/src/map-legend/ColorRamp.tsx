import React, { Fragment, useMemo } from 'react'
import cx from 'classnames'
import { scaleLinear } from 'd3-scale'
import styles from './MapLegend.module.css'
import {
  formatLegendValue,
  parseLegendNumber,
  roundLegendNumber,
  SCIENTIFIC_NOTATION_E,
} from './map-legend.utils'
import { LegendLayer } from './MapLegend'

type ColorRampLegendProps = {
  layer: LegendLayer
  className?: string
  roundValues?: boolean
  currentValueClassName?: string
  labelComponent?: React.ReactNode
}

export function ColorRampLegend({
  layer = {} as LegendLayer,
  className = '',
  roundValues = true,
  currentValueClassName = '',
  labelComponent = null,
}: ColorRampLegendProps) {
  const { gridArea, ramp, colorRamp, loading, label, unit, currentValue, type } = layer

  // Omit bucket that goes from -Infinity --> 0 on non-divergent scales.
  const omitFirstBucket = !layer.divergent
  const cleanRamp = omitFirstBucket ? ramp?.slice(1) : ramp
  const cleanValues = ramp?.filter(([value]) => value)
  const skipOddLabels = cleanValues && cleanValues.length >= 6 && !layer.divergent

  // This scale is only used to draw non discrete gradient, and current value positioning
  const heatmapLegendScale = useMemo(() => {
    if (!ramp || !cleanRamp) return null

    const domainValues = cleanRamp.map(([value]) => {
      if (value === 'less') return 0
      if (value === 'more') return 1
      return value as number
    })

    // Reuse d3 logic when values go beyond max value
    if (domainValues[0] === -Infinity) {
      domainValues[0] = domainValues[1] + domainValues[2]
    }

    const rangeValues = cleanRamp.map((item, i) => (i * 100) / cleanRamp.length)

    return (value: number) => {
      const scaled = scaleLinear().range(rangeValues).domain(domainValues)(value)
      return isNaN(scaled) || scaled < 0 ? 0 : scaled
    }
  }, [cleanRamp, ramp])

  const backgroundStyle = useMemo(() => {
    if (!cleanRamp || type === 'colorramp-discrete') return {}
    return {
      backgroundImage: `linear-gradient(to right, ${cleanRamp
        .map(([value, color]) => color)
        .join()})`,
    }
  }, [cleanRamp, type])

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

  if (loading && colorRamp && type === 'colorramp-discrete') {
    return (
      <div className={cx(styles.row, className)}>
        {Label}
        <div className={styles.ramp} style={backgroundStyle}>
          <div className={styles.discreteSteps}>
            {colorRamp.map((color: string, i: number) =>
              i > 0 ? (
                <span className={styles.discreteStep} key={i} style={{ backgroundColor: color }} />
              ) : null
            )}
          </div>
        </div>
        <div className={cx(styles.stepsContainer)}>
          {colorRamp.map((_: string, i: number) => {
            if (skipOddLabels && i !== 0 && i !== colorRamp.length && i % 2 === 1) return null
            return (
              <span
                className={cx(styles.step, {
                  [styles.lastStep]: !skipOddLabels && i === colorRamp.length - 1,
                })}
                style={{ left: `${(i * 100) / (colorRamp.length - 1)}%` }}
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

  if (!ramp || !cleanRamp) return null

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
      {cleanRamp?.length > 0 && (
        <Fragment>
          <div className={styles.ramp} style={backgroundStyle}>
            {currentValue !== null && currentValue !== undefined && heatmapLegendScale && (
              <span
                className={cx(styles.currentValue, currentValueClassName, {
                  [styles.offsetLeft]: heatmapLegendScale(currentValue) < 10,
                  [styles.offsetRight]: heatmapLegendScale(currentValue) > 90,
                })}
                style={{
                  left: `${Math.min(heatmapLegendScale(currentValue) as number, 100)}%`,
                }}
              >
                {formatLegendValue({
                  number: currentValue,
                  roundValues,
                  isFirst: false,
                  isLast: false,
                  divergent: layer.divergent,
                })}
              </span>
            )}
            {type === 'colorramp-discrete' && (
              <div className={styles.discreteSteps}>
                {cleanRamp.map(([value, color], i) => (
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
            {cleanRamp.map(([value], i) => {
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
                      isLast: i === cleanRamp.length - 1,
                      divergent: layer.divergent,
                    })

              if (skipOddLabels && i !== 0 && i !== ramp.length && i % 2 === 1) return null
              return (
                <span
                  className={cx(styles.step, {
                    [styles.firstStep]: omitFirstBucket && i === 0,
                    [styles.lastStep]:
                      !skipOddLabels && !layer.divergent && i === cleanRamp.length - 1,
                  })}
                  style={{ left: `${(i * 100) / cleanRamp.length}%` }}
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
