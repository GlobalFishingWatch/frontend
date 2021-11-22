import React from 'react'
import cx from 'classnames'
import type { Placement } from 'tippy.js'
import { Tooltip } from '../tooltip'
import { Spinner } from '../spinner'
import { TooltipTypes } from '../types/types'
import styles from './Button.module.css'

export type ButtonType = 'default' | 'secondary'
export type ButtonSize = 'default' | 'small' | 'big' | 'verybig'

interface ButtonProps {
  id?: string
  type?: ButtonType
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  className?: string
  children: React.ReactChild | React.ReactChild[] | TooltipTypes
  tooltip?: TooltipTypes
  tooltipPlacement?: Placement
  onClick?: (e: React.MouseEvent) => void
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
  href?: string
  target?: string
}

export function Button(props: ButtonProps) {
  const {
    id,
    type = 'default',
    size = 'default',
    disabled = false,
    loading = false,
    className,
    children,
    tooltip,
    tooltipPlacement = 'auto',
    onClick,
    onMouseEnter,
    onMouseLeave,
    href,
    target,
  } = props
  return (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      {href !== undefined && !disabled ? (
        <a
          href={href}
          target={target}
          onClick={onClick}
          className={cx(styles.button, styles[type], styles[size], className)}
        >
          {loading ? (
            <Spinner
              size="small"
              color={type === 'default' ? (disabled ? '#22447e' : 'white') : undefined}
            />
          ) : (
            children
          )}
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
        >
          {loading ? (
            <Spinner
              size="small"
              color={type === 'default' ? (disabled ? '#22447e' : 'white') : undefined}
            />
          ) : (
            children
          )}
        </button>
      )}
    </Tooltip>
  )
}
