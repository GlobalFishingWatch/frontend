import React, { memo } from 'react'
import cx from 'classnames'
import styles from './ColorBar.module.css'
import { ColorBarOption, ColorBarIds, ColorBarValues } from './index'

interface ColorBarProps {
  onColorClick?: (color: ColorBarOption, e: React.MouseEvent) => void
  selectedColor?: ColorBarIds | ColorBarValues
  disabledColors?: (ColorBarIds | ColorBarValues)[]
  className?: string
}

const colors: ColorBarOption[] = [
  { id: 'teal', value: '#00FFBC' },
  { id: 'magenta', value: '#FF64CE' },
  { id: 'lilac', value: '#9CA4FF' },
  { id: 'salmon', value: '#FFAE9B' },
  { id: 'sky', value: '#00EEFF' },
  { id: 'red', value: '#FF6854' },
  { id: 'yellow', value: '#FFEA00' },
  { id: 'green', value: '#A6FF59' },
  { id: 'orange', value: '#FFAA0D' },
]

function ColorBar(props: ColorBarProps) {
  const { onColorClick, className = '', selectedColor, disabledColors = [] } = props
  return (
    <ul className={cx(styles.listContainer, className)}>
      {colors.map((color) => {
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
