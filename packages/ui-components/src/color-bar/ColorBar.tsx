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
  '#F95E5E',
  '#21D375',
  '#F09300',
  '#FFE500',
  '#03E5BB',
  '#9E6AB0',
  '#F4511F',
  '#B39DDB',
  '#0B8043',
  '#4CBDD0',
  '#BB00FF',
  '#069688',
  '#4184F4',
  '#AD1457',
  '#FD5480',
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
