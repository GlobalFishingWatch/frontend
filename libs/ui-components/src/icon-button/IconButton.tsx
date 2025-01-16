import type { CSSProperties,Ref } from 'react'
import React, { forwardRef, Fragment } from 'react'
import cx from 'classnames'

import type { HTMLButtonType } from '../button/Button'
import type { IconType } from '../icon'
import { Icon } from '../icon'
import { Spinner } from '../spinner'
import type { TooltipPlacement } from '../tooltip'
import { Tooltip } from '../tooltip'
import type { TooltipTypes } from '../types/types'

import styles from './IconButton.module.css'

export type IconButtonType =
  | 'default'
  | 'invert'
  | 'border'
  | 'map-tool'
  | 'warning'
  | 'warning-border'
  | 'solid'
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
  tooltipPlacement?: TooltipPlacement
  children?: React.ReactNode
  style?: CSSProperties
  htmlType?: HTMLButtonType
  testId?: string
}

const warningVarColor =
  typeof window !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue('--color-danger-red')
    : 'rgb(360, 62, 98)'

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
    tooltipPlacement = 'top',
    children,
    style,
    htmlType,
    testId,
    ...rest
  } = props
  let spinnerColor
  if (type === 'invert' || type === 'map-tool') spinnerColor = 'white'
  if (type === 'warning' || type === 'warning-border') spinnerColor = warningVarColor || '#ff3e62'
  return (
    <Tooltip content={tooltip as React.ReactNode} placement={tooltipPlacement}>
      <button
        id={id}
        aria-label={icon || ''}
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
        type={htmlType ?? 'button'}
        style={style}
        {...(typeof tooltip === 'string' && { 'aria-label': tooltip })}
        {...(testId && { 'data-test': testId })}
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
            {icon && (
              <Icon
                icon={icon}
                type={type === 'warning' || type === 'warning-border' ? 'warning' : 'default'}
              />
            )}
            {children}
          </Fragment>
        )}
      </button>
    </Tooltip>
  )
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(IconButtonComponent)
