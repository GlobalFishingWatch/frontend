import React, { memo, useMemo } from 'react'
import cx from 'classnames'
import { scaleLinear } from 'd3-scale'
import styles from './MapLegend.module.css'
import { LegendLayer } from '.'

type ColorRampLegendProps = {
  layer: LegendLayer
  className?: string
  currentValueClassName?: string
}

function ColorRampLegend({
  layer = {} as LegendLayer,
  className = '',
  currentValueClassName = '',
}: ColorRampLegendProps) {
  const { gridArea, ramp, label, unit, currentValue, type } = layer

  // Omit bucket that goes from -Infinity --> 0. Will have to add an exception if we need a divergent scale
  const cleanRamp = ramp?.filter(([value]) => value !== Number.NEGATIVE_INFINITY)

  const skipOddLabels = ramp && ramp.length > 6

  const heatmapLegendScale = useMemo(() => {
    if (!ramp || !cleanRamp) return null

    return scaleLinear()
      .range(cleanRamp.map((item, i) => (i * 100) / (ramp.length - 1)))
      .domain(cleanRamp.map(([value]) => value as number))
  }, [cleanRamp, ramp])

  if (!ramp || !cleanRamp) return null

  return (
    <div className={cx(styles.row, className)}>
      {label && (
        <p>
          {label}
          {unit && (
            <span className={styles.subTitle}>
              {' '}
              ({unit}
              {gridArea && (
                <span>
                  {' '}
                  by {gridArea}
                  {gridArea > 100000 ? 'km' : 'm'}
                  <sup>2</sup>
                </span>
              )}
              )
            </span>
          )}
        </p>
      )}
      <div
        className={styles.ramp}
        style={{
          backgroundImage: `linear-gradient(to right, ${cleanRamp
            .map(([value, color]) => color)
            .join()})`,
        }}
      >
        {currentValue && (
          <span
            className={cx(styles.currentValue, currentValueClassName)}
            style={{
              left: heatmapLegendScale
                ? `${Math.min(heatmapLegendScale(currentValue) as number, 100)}%`
                : 0,
            }}
          >
            {currentValue}
          </span>
        )}
        {type === 'colorramp-discrete' && (
          <div className={styles.discreteSteps}>
            {cleanRamp.map(([value, color], i) => (
              <span className={styles.discreteStep} key={i} style={{ backgroundColor: color }} />
            ))}
          </div>
        )}
      </div>
      <div className={styles.stepsContainer}>
        {cleanRamp.map(([value], i) => {
          if (value === null) return null
          if (skipOddLabels && i !== 0 && i !== ramp.length && i % 2 === 1) return null
          return (
            <span
              className={styles.step}
              style={{ left: `${(i * 100) / (ramp.length - 1)}%` }}
              key={i}
            >
              {(i === ramp.length - 1 && !isNaN(value as number) ? '≥ ' : '') +
                (value >= 1000 ? `${((value as number) / 1000).toFixed(1)}k` : value)}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default memo(ColorRampLegend)
