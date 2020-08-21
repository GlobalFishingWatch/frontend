import React, { memo } from 'react'
import cx from 'classnames'
import styles from './ColorBar.module.css'
import { ColorBarOptions } from './index'

interface ColorBarProps {
  onColorClick?: (color: ColorBarOptions, e: React.MouseEvent) => void
  selectedColor?: ColorBarOptions
  disabledColors?: ColorBarOptions[]
  className?: string
}

const colors: ColorBarOptions[] = [
  '#00FFBC',
  '#FF64CE',
  '#9CA4FF',
  '#FFAE9B',
  '#00EEFF',
  '#FF6854',
  '#FFEA00',
  '#A6FF59',
  '#FFC300',
]

function ColorBar(props: ColorBarProps) {
  const { onColorClick, className = '', selectedColor, disabledColors = [] } = props
  return (
    <ul className={cx(styles.listContainer, className)}>
      {colors.map((color) => (
        <li key={color} className={styles.colorContainer}>
          <button
            className={cx(styles.color, {
              [styles.colorActive]: selectedColor === color,
              [styles.colorDisabled]: disabledColors.includes(color),
            })}
            style={{ backgroundColor: color }}
            onClick={(e) =>
              onColorClick && !disabledColors.includes(color) && onColorClick(color, e)
            }
          ></button>
        </li>
      ))}
    </ul>
  )
}

export default memo(ColorBar)
