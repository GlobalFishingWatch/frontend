import React, { memo } from 'react'
import cx from 'classnames'
import styles from './ColorBar.module.css'
import { ColorBarOption, ColorBarIds, ColorBarValues, ColorBarOptions } from './index'

interface ColorBarProps {
  onColorClick?: (color: ColorBarOption, e: React.MouseEvent) => void
  selectedColor?: ColorBarIds | ColorBarValues
  disabledColors?: (ColorBarIds | ColorBarValues)[]
  className?: string
}

function ColorBar(props: ColorBarProps) {
  const { onColorClick, className = '', selectedColor, disabledColors = [] } = props
  return (
    <ul className={cx(styles.listContainer, className)}>
      {ColorBarOptions.map((color) => {
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
