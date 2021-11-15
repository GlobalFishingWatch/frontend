import React, { forwardRef, Fragment, Ref, CSSProperties } from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import { Icon, IconType } from '../icon'
import { TooltipTypes } from '../types/types'
import { Tooltip } from '../tooltip'
import { Spinner } from '../spinner'
import styles from './IconButton.module.css'

export type IconButtonType = 'default' | 'invert' | 'border' | 'map-tool' | 'warning' | 'solid'
export type IconButtonSize = 'default' | 'medium' | 'small' | 'tiny'

export interface IconButtonProps {
  id?: string
  icon?: IconType
  type?: IconButtonType
  size?: IconButtonSize
  className?: string
  disabled?: boolean
  loading?: boolean
  onClick?: (e: React.MouseEvent) => void
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
  tooltip?: TooltipTypes
  tooltipPlacement?: Placement
  children?: React.ReactNode
  style?: CSSProperties
}

const warningVarColor = getComputedStyle(document.documentElement).getPropertyValue(
  '--color-danger-red'
)

function IconButtonComponent(props: IconButtonProps, ref: Ref<HTMLButtonElement>) {
  const {
    id,
    type = 'default',
    size = 'default',
    disabled = false,
    loading = false,
    className,
    icon,
    onClick,
    onMouseEnter,
    onMouseLeave,
    tooltip,
    tooltipPlacement = 'auto',
    children,
    style,
    ...rest
  } = props
  let spinnerColor
  if (type === 'invert' || type === 'map-tool') spinnerColor = 'white'
  if (type === 'warning') spinnerColor = warningVarColor || '#ff3e62'
  return (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      <button
        id={id}
        ref={ref}
        className={cx(
          styles.iconButton,
          styles[type],
          styles[`${size}Size`],
          { [styles.disabled]: disabled },
          className
        )}
        onClick={disabled ? undefined : onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...(typeof tooltip === 'string' && { 'aria-label': tooltip })}
        style={style}
        {...rest}
      >
        {loading ? (
          <Spinner
            inline
            size={size === 'tiny' || size === 'small' ? 'tiny' : 'small'}
            color={spinnerColor}
          />
        ) : (
          <Fragment>
            {icon && <Icon icon={icon} type={type === 'warning' ? 'warning' : 'default'} />}
            {children}
          </Fragment>
        )}
      </button>
    </Tooltip>
  )
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(IconButtonComponent)
