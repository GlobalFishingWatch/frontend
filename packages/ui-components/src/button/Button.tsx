import React from 'react'
import cx from 'classnames'
import styles from './Button.module.css'

type ButtonTypes = 'default' | 'secondary'

interface ButtonProps {
  type?: ButtonTypes
  className?: string
  children: string
}

const Button: React.FC<ButtonProps> = (props) => {
  const { type = 'default', className, children } = props
  return (
    <button className={cx(styles.button, { [styles.secondary]: type === 'secondary' }, className)}>
      {children}
    </button>
  )
}

export default Button
