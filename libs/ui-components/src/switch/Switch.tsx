import type { MouseEvent } from 'react'
import React from 'react'
import cx from 'classnames'

import type { TooltipPlacement } from '../tooltip'
import { Tooltip } from '../tooltip'
import type { TooltipTypes } from '../types/types'

import styles from './Switch.module.css'

// TODO Maybe a simple way is to have the Switch component wrap an <input type="checkbox"> so that we can use the React native event
export interface SwitchEvent extends MouseEvent {
  active: boolean
}

type SwitchSize = 'default' | 'small'

export interface SwitchProps {
  id?: string
  active: boolean
  disabled?: boolean
  onClick: (event: SwitchEvent) => void
  color?: string
  tooltip?: TooltipTypes
  tooltipPlacement?: TooltipPlacement
  className?: string
  size?: SwitchSize
  testId?: string
}

export function Switch(props: SwitchProps) {
  const {
    id,
    active = false,
    disabled = false,
    color,
    onClick,
    size = 'default',
    tooltip,
    tooltipPlacement = 'top',
    className,
    testId,
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
    <Tooltip content={tooltip as React.ReactNode} placement={tooltipPlacement}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={active}
        {...(testId && { 'data-test': testId })}
        {...(typeof tooltip === 'string' && { 'aria-label': tooltip })}
        onClick={onClickCallback}
        className={cx(
          styles.switch,
          styles[size],
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
