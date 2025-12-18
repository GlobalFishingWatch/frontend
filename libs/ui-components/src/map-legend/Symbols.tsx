import React from 'react'
import cx from 'classnames'

import { Icon } from '../icon'

import { formatLegendValue } from './map-legend.utils'
import type { UILegendSymbols } from './types'

import styles from './MapLegend.module.css'

type SymbolsLegendProps = {
  layer: UILegendSymbols
  className?: string
}

export function SymbolsLegend({ layer, className }: SymbolsLegendProps) {
  const { symbol = 'vector-arrow', label, unit, values, colors } = (layer || {}) as UILegendSymbols
  console.log('🚀 ~ SymbolsLegend ~ values:', values)
  console.log('🚀 ~ SymbolsLegend ~ colors:', colors)
  return (
    <div className={cx(styles.row, className)}>
      {label && <p className={styles.legendLabel}>{label}</p>}

      {values && values.length > 0 && (
        <div className={styles.symbols}>
          <div className={styles.symbolsContainer}>
            {colors?.map((color, index) => (
              <div key={color} className={styles.symbol}>
                <Icon
                  icon={symbol}
                  className={styles.symbolBackground}
                  style={{ transform: `scale(${(index + 1) * (1 / colors.length) + 0.2})` }}
                />
                <Icon
                  icon={symbol}
                  className={styles.symbolColor}
                  style={{ transform: `scale(${(index + 1) * (1 / colors.length) + 0.2})`, color }}
                />
              </div>
            ))}
          </div>
          <div className={styles.valuesContainer}>
            <span className={styles.valueLabel}>
              {formatLegendValue({ number: values[0], roundValues: false })}
            </span>
            <span className={styles.valueLabel}>
              {formatLegendValue({ number: values[values.length - 1], roundValues: false })}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
