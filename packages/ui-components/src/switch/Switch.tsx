import React, { memo } from 'react'
import cx from 'classnames'

import Tooltip from '../tooltip'
import styles from './Switch.module.css'
import { SwitchProps } from '.'

function Switch(props: SwitchProps) {
  const {
    id,
    active = false,
    disabled = false,
    color,
    onClick,
    tooltip,
    tooltipPlacement = 'top',
    className,
  } = props

  const onClickCallback = (event: React.MouseEvent) => {
    if (!disabled) {
      onClick({
        ...event,
        active,
      })
    }
  }

  return (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={active}
        {...(typeof tooltip === 'string' && { 'aria-label': tooltip })}
        onClick={onClickCallback}
        className={cx(
          styles.switch,
          { [styles.disabled]: disabled, [styles.customColor]: color },
          className
        )}
        {...(color && { style: { color } })}
      >
        <span className={styles.nib}></span>
      </button>
    </Tooltip>
  )
}

export default memo(Switch)
