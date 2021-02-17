import React, { memo } from 'react'
import cx from 'classnames'
import type { Placement } from 'tippy.js'
import Tooltip from '../tooltip'
import Spinner from '../spinner'
import { TooltipTypes } from '../types/types'
import styles from './Button.module.css'

export type ButtonType = 'default' | 'secondary'
export type ButtonSize = 'default' | 'small'

interface ButtonProps {
  id?: string
  type?: ButtonType
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  className?: string
  children: React.ReactChild | React.ReactChild[] | TooltipTypes
  tooltip?: React.ReactChild | React.ReactChild[] | string
  tooltipPlacement?: Placement
  onClick?: (e: React.MouseEvent) => void
  href?: string
}

function Button(props: ButtonProps) {
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
    href,
  } = props
  return (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      {href !== undefined ? (
        <a href={href} className={cx(styles.button, styles[type], styles[size], className)}>
          {children}
        </a>
      ) : (
        <button
          id={id}
          className={cx(styles.button, styles[type], styles[size], className)}
          onClick={(e) => !loading && onClick && onClick(e)}
          disabled={disabled}
        >
          {loading ? (
            <Spinner size="small" color={type === 'default' ? 'white' : undefined} />
          ) : (
            children
          )}
        </button>
      )}
    </Tooltip>
  )
}

export default memo(Button)
