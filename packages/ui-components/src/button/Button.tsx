import React from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import Tooltip from '../tooltip'
import styles from './Button.module.css'

type ButtonTypes = 'default' | 'secondary'
type ButtonContent = React.ReactChild | React.ReactChild[]

interface ButtonProps {
  type?: ButtonTypes
  disabled?: boolean
  className?: string
  children: ButtonContent
  tooltip?: ButtonContent
  tooltipPlacement?: Placement
  onClick?: (e: React.MouseEvent) => void
}

const Button: React.FC<ButtonProps> = (props) => {
  const {
    type = 'default',
    disabled = false,
    className,
    children,
    tooltip,
    tooltipPlacement = 'auto',
    onClick,
  } = props
  return (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      <button
        className={cx(styles.Button, { [styles.secondary]: type === 'secondary' }, className)}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </Tooltip>
  )
}

export default Button
