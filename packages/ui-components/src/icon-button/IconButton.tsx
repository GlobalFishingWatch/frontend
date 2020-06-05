import React from 'react'
import cx from 'classnames'
import { ReactComponent as ArrowDownIcon } from '../assets/icons/arrow-down.svg'
import styles from './IconButton.module.css'

type IconButtonTypes = 'default' | 'invert'
type Icons =
  | 'arrow-down'
  | 'arrow-right'
  | 'arrow-top'
  | 'camera'
  | 'close'
  | 'compare'
  | 'delete'
  | 'download'
  | 'edit'
  | 'email'
  | 'graph'
  | 'home'
  | 'info'
  | 'menu'
  | 'minus'
  | 'plus'
  | 'publish'
  | 'remove-from-map'
  | 'ruler'
  | 'satellite'
  | 'search'
  | 'share'
  | 'split'
  | 'view-on-map'
  | 'warning'

interface IconButtonProps {
  type?: IconButtonTypes
  className?: string
  icon: Icons
}

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { type = 'default', className } = props
  return (
    <button className={cx(styles.IconButton, { [styles.invert]: type === 'invert' }, className)}>
      <ArrowDownIcon />
    </button>
  )
}

export default IconButton
