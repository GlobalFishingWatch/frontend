import React, { forwardRef } from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import Icon, { IconType } from '../icon'
import Tooltip from '../tooltip'
import styles from './IconButton.module.css'

export type IconButtonType = 'default' | 'invert' | 'border' | 'warning'
export type IconButtonSize = 'default' | 'small' | 'tiny'

interface IconButtonProps {
  icon: IconType
  type?: IconButtonType
  size?: IconButtonSize
  className?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
  tooltip?: React.ReactChild | React.ReactChild[] | string
  tooltipPlacement?: Placement
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
    ...rest
  } = props
  return (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      <button
        ref={ref}
        className={cx(styles.IconButton, styles[type], styles[`${size}Size`], className)}
        onClick={onClick}
        disabled={disabled}
        {...rest}
      >
        <Icon icon={icon} type={type === 'warning' ? 'warning' : 'default'} />
      </button>
    </Tooltip>
  )
})

export default IconButton
