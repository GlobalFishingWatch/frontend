import React, { MouseEvent, memo } from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import Tooltip from '../tooltip'
import { TooltipTypes } from '../types'
import styles from './Switch.module.css'

// TODO Maybe a simple way is to have the Switch component wrap an <input type="checkbox"> so that we can use the React native event
export interface SwitchEvent extends MouseEvent {
  active: boolean
}

interface SwitchProps {
  active: boolean
  disabled?: boolean
  onClick: (event: SwitchEvent) => void
  color?: string
  tooltip?: TooltipTypes
  tooltipPlacement?: Placement
  className?: string
}

function Switch(props: SwitchProps) {
  const {
    active = false,
    disabled = false,
    color,
    onClick,
    tooltip,
    tooltipPlacement = 'top',
    className,
  } = props

  const onClickCallback = (event: React.MouseEvent) => {
    onClick({
      ...event,
      active,
    })
  }

  return (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      <button
        type="button"
        role="switch"
        aria-checked={active}
        disabled={disabled}
        {...(typeof tooltip === 'string' && { 'aria-label': tooltip })}
        onClick={onClickCallback}
        className={cx(styles.switch, { [styles.customColor]: color }, className)}
        {...(color && { style: { color } })}
      >
        <span className={styles.nib}></span>
      </button>
    </Tooltip>
  )
}

export default memo(Switch)
