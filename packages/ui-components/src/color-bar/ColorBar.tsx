import React, { memo } from 'react'
import cx from 'classnames'
import styles from './ColorBar.module.css'
import { ColorBarOption, HeatmapColorBarOptions } from './index'

interface ColorBarProps {
  onColorClick?: (color: ColorBarOption, e: React.MouseEvent) => void
  selectedColor?: string
  disabledColors?: string[]
  colorBarOptions: ColorBarOption[]
  className?: string
}

function ColorBar(props: ColorBarProps) {
  const {
    onColorClick,
    className = '',
    selectedColor,
    colorBarOptions = HeatmapColorBarOptions,
    disabledColors = [],
  } = props
  return (
    <ul className={cx(styles.listContainer, className)}>
      {colorBarOptions.map((color) => {
        const disabledColor =
          disabledColors.includes(color.id) || disabledColors.includes(color.value)
        return (
          <li key={color.id} className={styles.colorContainer}>
            <button
              className={cx(styles.color, {
                [styles.colorActive]: selectedColor === color.id || selectedColor === color.value,
                [styles.colorDisabled]: disabledColor,
              })}
              style={{ backgroundColor: color.value }}
              onClick={(e) => onColorClick && !disabledColor && onColorClick(color, e)}
            ></button>
          </li>
        )
      })}
    </ul>
  )
}

export default memo(ColorBar)
