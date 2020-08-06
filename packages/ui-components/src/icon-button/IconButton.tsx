import React, { forwardRef } from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import Icon, { IconType } from '../icon'
import Tooltip from '../tooltip'
import styles from './IconButton.module.css'

export type IconButtonType = 'default' | 'invert' | 'border' | 'map-tool' | 'warning'
export type IconButtonSize = 'default' | 'small' | 'tiny'

interface IconButtonProps {
  icon?: IconType
  type?: IconButtonType
  size?: IconButtonSize
  className?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
  tooltip?: React.ReactChild | React.ReactChild[] | string
  tooltipPlacement?: Placement
  children?: React.ReactNode
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const {
    type = 'default',
    size = 'default',
    disabled = false,
    className,
    icon,
    onClick,
    tooltip,
    tooltipPlacement = 'auto',
    children,
    ...rest
  } = props
  return (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      <button
        ref={ref}
        className={cx(styles.iconButton, styles[type], styles[`${size}Size`], className)}
        onClick={onClick}
        disabled={disabled}
        {...(typeof tooltip === 'string' && { 'aria-label': tooltip })}
        {...rest}
      >
        {icon && <Icon icon={icon} type={type === 'warning' ? 'warning' : 'default'} />}
        {children}
      </button>
    </Tooltip>
  )
})

export default IconButton
