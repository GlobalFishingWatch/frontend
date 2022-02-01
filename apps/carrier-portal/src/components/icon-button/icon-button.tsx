import React from 'react'
import cx from 'classnames'
import styles from './icon-button.module.css'

interface IconButtonProps {
  id?: string
  size?: 'small' | 'regular'
  className?: string
  children: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const IconButton: React.FC<IconButtonProps> = ({
  id = '',
  onClick,
  children,
  className = '',
  size = 'regular',
  ...rest
}) => (
  <button
    id={id}
    className={cx(styles.button, styles[size], className)}
    onClick={onClick}
    {...rest}
  >
    {children}
  </button>
)

export default IconButton
