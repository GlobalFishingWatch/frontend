import React, { Fragment } from 'react'
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
  const { symbol = 'vector-arrow', label, colors, values } = (layer || {}) as UILegendSymbols
  return (
    <div className={cx(styles.row, className)}>
      {label && <p>{label}</p>}
      {values && values.length > 0 && (
        <div className={styles.symbols}>
          <span>
            {formatLegendValue({ number: values[0], roundValues: false })}
            <Icon icon={symbol} className={styles.symbol} />
          </span>
          <span>
            {formatLegendValue({ number: values[1] / 2, roundValues: true })}
            <Icon icon={symbol} className={styles.symbol} />
          </span>
          <span>
            <Icon icon={symbol} className={styles.symbol} />≥
            {formatLegendValue({ number: values[1], roundValues: values[1] > 5 })}
          </span>
        </div>
      )}
    </div>
  )
}
