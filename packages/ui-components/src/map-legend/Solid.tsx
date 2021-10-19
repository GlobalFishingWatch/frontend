import React from 'react'
import cx from 'classnames'
import styles from './MapLegend.module.css'
import { LegendLayer } from './'

type SolidLegendProps = {
  layer: LegendLayer
  className?: string
}

export function SolidLegend({ layer, className }: SolidLegendProps) {
  const { label, color } = (layer || {}) as LegendLayer
  return (
    <div className={cx(styles.row, styles.rowColum, className)}>
      {color && <span className={styles.line} style={{ backgroundColor: color }} />}
      {label && <p>{label}</p>}
    </div>
  )
}
