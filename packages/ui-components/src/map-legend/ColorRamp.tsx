import React, { memo, useMemo } from 'react'
import cx from 'classnames'
import { scaleLinear } from 'd3-scale'
import styles from './MapLegend.module.css'
import { LegendLayer } from './MapLegend'

type ColorRampLegendProps = {
  layer: LegendLayer
  className?: string
}

function ColorRampLegend({ layer, className }: ColorRampLegendProps) {
  const { gridArea, ramp, label, unit, currentValue } = (layer || {}) as LegendLayer

  const heatmapLegendScale = useMemo(() => {
    if (!ramp) return null

    return scaleLinear()
      .range(ramp.map((item, i) => (i * 100) / (ramp.length - 1)))
      .domain(ramp.map(([value]) => value))
  }, [ramp])

  if (!ramp) return null
  return (
    <div className={cx(styles.row, className)}>
      {/* TODO: grab this from meta in generator or external dictionary by keys*/}
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
                  by {(gridArea > 100000 ? gridArea / 1000000 : gridArea).toLocaleString('en-EN')}
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
          backgroundImage: `linear-gradient(to right, ${ramp
            .map(([value, color]) => color)
            .join()})`,
        }}
      >
        {currentValue && (
          <span
            className={styles.currentValue}
            style={{
              left: heatmapLegendScale ? `${Math.min(heatmapLegendScale(currentValue), 100)}%` : 0,
            }}
          >
            {currentValue}
          </span>
        )}
      </div>
      <div className={styles.stepsContainer}>
        {ramp.map(([value], i) => {
          if (value === null) return null
          return (
            <span
              className={styles.step}
              style={{ left: `${(i * 100) / (ramp.length - 1)}%` }}
              key={i}
            >
              {(i === ramp.length - 1 ? '≥ ' : '') + (value >= 1000 ? `${value / 1000}k` : value)}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default memo(ColorRampLegend)
