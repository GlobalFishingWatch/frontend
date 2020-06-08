import React from 'react'
import cx from 'classnames'
import Icon, { IconType } from '../icon'
import styles from './IconButton.module.css'

export type IconButtonType = 'default' | 'invert' | 'border'
export type IconButtonSize = 'default' | 'small' | 'tiny'

interface IconButtonProps {
  icon: IconType
  type?: IconButtonType
  size?: IconButtonSize
  className?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
}

const isDestructiveIcon = (icon: IconType) => icon === 'delete' || icon === 'warning'

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { type = 'default', size = 'default', disabled = false, className, icon, onClick } = props
  return (
    <button
      className={cx(
        styles.IconButton,
        styles[type],
        styles[`${size}Size`],
        { [styles.destructive]: isDestructiveIcon(icon) },
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon icon={icon} />
    </button>
  )
}

export default IconButton
