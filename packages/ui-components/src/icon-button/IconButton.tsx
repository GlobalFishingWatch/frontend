import React, {
  forwardRef,
  Fragment,
  ForwardRefRenderFunction,
  Ref,
  memo,
  CSSProperties,
} from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import Icon, { IconType } from '../icon'
import Tooltip from '../tooltip'
import Spinner from '../spinner'
import styles from './IconButton.module.css'

export type IconButtonType = 'default' | 'invert' | 'border' | 'map-tool' | 'warning'
export type IconButtonSize = 'default' | 'small' | 'tiny'

interface IconButtonProps {
  icon?: IconType
  type?: IconButtonType
  size?: IconButtonSize
  className?: string
  disabled?: boolean
  loading?: boolean
  onClick?: (e: React.MouseEvent) => void
  tooltip?: React.ReactChild | React.ReactChild[] | string
  tooltipPlacement?: Placement
  children?: React.ReactNode
  style?: CSSProperties
}

const warningVarColor = getComputedStyle(document.documentElement).getPropertyValue(
  '--color-danger-red'
)

function IconButton(props: IconButtonProps, ref: Ref<HTMLButtonElement>) {
  const {
    type = 'default',
    size = 'default',
    disabled = false,
    loading = false,
    className,
    icon,
    onClick,
    tooltip,
    tooltipPlacement = 'auto',
    children,
    ...rest
  } = props
  let spinnerColor
  if (type === 'invert' || type === 'map-tool') spinnerColor = 'white'
  if (type === 'warning') spinnerColor = warningVarColor || '#ff3e62'
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
        {loading ? (
          <Spinner size="small" color={spinnerColor} />
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

export default memo(forwardRef<HTMLButtonElement, IconButtonProps>(IconButton))
