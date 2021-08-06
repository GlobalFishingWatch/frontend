import React, { forwardRef, Fragment, Ref, memo } from 'react'
import cx from 'classnames'
import Icon from '../icon'
import Tooltip from '../tooltip'
import Spinner from '../spinner'
import styles from './IconButton.module.css'
import { IconButtonProps } from '.'

const warningVarColor = getComputedStyle(document.documentElement).getPropertyValue(
  '--color-danger-red'
)

function IconButton(props: IconButtonProps, ref: Ref<HTMLButtonElement>) {
  const {
    id,
    type = 'default',
    size = 'default',
    active = 'false',
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

export default memo(forwardRef<HTMLButtonElement, IconButtonProps>(IconButton))
