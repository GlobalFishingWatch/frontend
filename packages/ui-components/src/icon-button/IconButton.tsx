import React from 'react'
import cx from 'classnames'
import Icon, { IconType } from '../icon'
import styles from './IconButton.module.css'

type IconButtonTypes = 'default' | 'invert' | 'border'

interface IconButtonProps {
  icon: IconType
  type?: IconButtonTypes
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { type = 'default', className, icon, onClick } = props
  return (
    <button className={cx(styles.IconButton, styles[type], className)} onClick={onClick}>
      <Icon icon={icon} />
    </button>
  )
}

export default IconButton
