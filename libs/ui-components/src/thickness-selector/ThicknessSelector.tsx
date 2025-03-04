import React from 'react'
import cx from 'classnames'

import { THICKNESS_OPTIONS, type ThicknessSelectorOption } from './thickness-selector-options'

import styles from './ThicknessSelector.module.css'

interface ThicknessSelectorProps {
  onThicknessClick?: (thickness: ThicknessSelectorOption, e?: React.MouseEvent) => void
  selectedThickness?: number
}

export function ThicknessSelector(props: ThicknessSelectorProps) {
  const { onThicknessClick, selectedThickness = 1 } = props

  return (
    <ul className={styles.wrapper}>
      {THICKNESS_OPTIONS.map((thickness) => (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <li
          className={cx(styles.option, {
            [styles.selected]: thickness.value === selectedThickness,
          })}
          key={thickness.id}
          style={{ height: `${thickness.value * 3}px` }}
          onClick={(e) => onThicknessClick && onThicknessClick(thickness, e)}
        />
      ))}
    </ul>
  )
}
