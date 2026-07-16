import React from 'react'
import cx from 'classnames'

import { Spinner } from '../spinner'
import type { TooltipPlacement } from '../tooltip'
import { Tooltip } from '../tooltip'
import type { TooltipTypes } from '../types/types'

import styles from './Button.module.css'

export type ButtonType = 'default' | 'secondary' | 'border-secondary'
export type ButtonSize = 'tiny' | 'small' | 'medium' | 'default' | 'big' | 'verybig'
export type HTMLButtonType = 'submit' | 'reset' | 'button' | undefined

export interface ButtonProps {
  id?: string
  type?: ButtonType
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  className?: string
  children: React.ReactNode
  tooltip?: TooltipTypes
  tooltipPlacement?: TooltipPlacement
  onClick?: (e: React.MouseEvent) => void
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
  href?: string
  target?: string
  htmlType?: HTMLButtonType
  testId?: string
}

export function Button(props: ButtonProps) {
  const {
    id,
    type = 'default',
    size = 'default',
    disabled = false,
    loading = false,
    icon,
    className,
    children,
    tooltip,
    tooltipPlacement = 'top',
    onClick,
    onMouseEnter,
    onMouseLeave,
    href,
    target,
    htmlType,
    testId,
  } = props
  const spinner = (
    <Spinner
      size={icon ? 'tiny' : 'small'}
      color={type === 'default' ? (disabled ? '#22447e' : 'white') : undefined}
    />
  )
  const content = icon ? (
    <React.Fragment>
      {loading ? spinner : icon}
      {children}
    </React.Fragment>
  ) : loading ? (
    spinner
  ) : (
    children
  )
  return (
    <Tooltip content={tooltip as React.ReactNode} placement={tooltipPlacement}>
      {href !== undefined && !disabled ? (
        <a
          href={href}
          target={target}
          onClick={onClick}
          className={cx(styles.button, styles[type], styles[size], className)}
        >
          {content}
        </a>
      ) : (
        <button
          id={id}
          className={cx(styles.button, styles[type], styles[size], className, {
            [styles.disabled]: disabled,
          })}
          onClick={(e) => !loading && !disabled && onClick && onClick(e)}
          onMouseEnter={(e) => onMouseEnter && onMouseEnter(e)}
          onMouseLeave={(e) => onMouseLeave && onMouseLeave(e)}
          {...(testId && { 'data-testid': testId })}
          {...(htmlType ? { type: htmlType } : {})}
        >
          {content}
        </button>
      )}
    </Tooltip>
  )
}
