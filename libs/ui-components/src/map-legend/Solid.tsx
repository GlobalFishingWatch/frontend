import React from 'react'
import cx from 'classnames'

import type { UILegendSolid } from './types'

import styles from './MapLegend.module.css'

type SolidLegendProps = {
  layer: UILegendSolid
  className?: string
}

export function SolidLegend({ layer, className }: SolidLegendProps) {
  const { label, color } = (layer || {}) as UILegendSolid
  return (
    <div className={cx(styles.row, styles.rowColum, className)}>
      {color && <span className={styles.line} style={{ backgroundColor: color }} />}
      {label && <p>{label}</p>}
    </div>
  )
}
