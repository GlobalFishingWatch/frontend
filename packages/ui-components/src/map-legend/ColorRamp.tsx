import React, { Fragment, memo, useMemo } from 'react'
import cx from 'classnames'
import { scaleLinear } from 'd3-scale'
import styles from './MapLegend.module.css'
import { formatLegendValue, LegendLayer, parseLegendNumber, roundLegendNumber } from '.'

type ColorRampLegendProps = {
  layer: LegendLayer
  className?: string
  roundValues?: boolean
  currentValueClassName?: string
  labelComponent?: React.ReactNode
}

function ColorRampLegend({
  layer = {} as LegendLayer,
  className = '',
  roundValues = true,
  currentValueClassName = '',
  labelComponent = null,
}: ColorRampLegendProps) {
  const { gridArea, ramp, colorRamp, loading, label, unit, currentValue, type } = layer

  // Omit bucket that goes from -Infinity --> 0. Will have to add an exception if we need a divergent scale
  const cleanRamp = ramp?.filter(([value]) => value !== Number.NEGATIVE_INFINITY)
  const cleanValues = ramp?.filter(([value]) => value)
  const skipOddLabels = cleanValues && cleanValues.length >= 6

  const heatmapLegendScale = useMemo(() => {
    if (!ramp || !cleanRamp) return null

    const domainValues = cleanRamp.map(([value]) => {
      if (value === 'less') return 0
      if (value === 'more') return 1
      return value as number
    })

    return scaleLinear()
      .range(cleanRamp.map((item, i) => (i * 100) / (ramp.length - 1)))
      .domain(domainValues)
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
          {colorRamp.map((color: string, i: number) => {
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

  return (
    <div className={cx(styles.row, className)}>
      {Label}
      {cleanRamp?.length > 0 && (
        <Fragment>
          <div className={styles.ramp} style={backgroundStyle}>
            {currentValue && heatmapLegendScale && (
              <span
                className={cx(styles.currentValue, currentValueClassName, {
                  [styles.offsetLeft]: heatmapLegendScale(currentValue) < 10,
                  [styles.offsetRight]: heatmapLegendScale(currentValue) > 90,
                })}
                style={{
                  left: `${Math.min(heatmapLegendScale(currentValue) as number, 100)}%`,
                }}
              >
                {formatLegendValue(currentValue)}
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
              if (value === null) return null
              const roundValue = roundValues
                ? roundLegendNumber(value as number)
                : parseLegendNumber(value as number)
              const valueLabel = typeof value === 'string' ? value : formatLegendValue(roundValue)
              if (skipOddLabels && i !== 0 && i !== ramp.length && i % 2 === 1) return null
              return (
                <span
                  className={cx(styles.step, {
                    [styles.lastStep]: !skipOddLabels && i === cleanRamp.length - 1,
                  })}
                  style={{ left: `${(i * 100) / (ramp.length - 1)}%` }}
                  key={i}
                >
                  {(i === ramp.length - 1 && !isNaN(roundValue) ? '≥ ' : '') + valueLabel}
                </span>
              )
            })}
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default memo(ColorRampLegend)
