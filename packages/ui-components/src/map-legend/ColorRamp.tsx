import React, { memo, useMemo } from 'react'
import { scaleLinear } from 'd3-scale'
import { ExtendedLayer, LayerMetadataLegend } from '@globalfishingwatch/layer-composer/dist/types'
import styles from './MapLegend.module.css'

type ColorRampLegendProps = {
  layer: ExtendedLayer
  onClick?: (layer: ExtendedLayer, event: React.MouseEvent) => void
}

function ColorRampLegend({ layer }: ColorRampLegendProps) {
  const { ramp, gridArea, label, unit, currentValue } = layer?.metadata
    ?.legend as LayerMetadataLegend

  const heatmapLegendScale = useMemo(() => {
    if (!ramp) return null

    return scaleLinear()
      .range(ramp.map((item, i) => (i * 100) / (ramp.length - 1)))
      .domain(ramp.map(([value]) => value))
  }, [ramp])

  if (!ramp) return null
  return (
    <div className={styles.legendEventContainer}>
      <div className={styles.legendHeatmap}>
        {/* TODO: grab this from meta in generator */}
        {label && (
          <span className={styles.legendTitle}>
            {label}
            {unit && <span className={styles.legendSubTitle}> ({unit})</span>}
          </span>
        )}
        {gridArea && (
          <span className={styles.legendDimmed}>
            <span>
              by {(gridArea > 100000 ? gridArea / 1000000 : gridArea).toLocaleString('en-EN')}
              {gridArea > 100000 ? 'km' : 'm'}
            </span>
            <sup>2</sup>
          </span>
        )}
        <div className={styles.legendHeatmapContent}>
          <div
            className={styles.legendHeatmapContentRamp}
            style={{
              backgroundImage: `linear-gradient(to right, ${ramp
                .map(([value, color]) => color)
                .join()})`,
            }}
          >
            {currentValue && (
              <span
                className={styles.legendHeatmapCurrentValue}
                style={{
                  left: heatmapLegendScale
                    ? `${Math.min(heatmapLegendScale(currentValue), 100)}%`
                    : 0,
                }}
              >
                {currentValue}
              </span>
            )}
          </div>
          <div className={styles.legendHeatmapContentSteps}>
            {ramp.map(([value], i) => {
              if (value === null) return null
              return (
                <span
                  className={styles.legendHeatmapContentStep}
                  style={{ left: `${(i * 100) / (ramp.length - 1)}%` }}
                  key={i}
                >
                  {(i === ramp.length - 1 ? '≥ ' : '') +
                    (value >= 1000 ? `${value / 1000}k` : value)}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ColorRampLegend)
