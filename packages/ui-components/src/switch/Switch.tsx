import React, { memo } from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import Tooltip from '../tooltip'
import { TooltipTypes } from '../types/types'
import styles from './Switch.module.css'
import { SwitchEvent } from '.'

export interface SwitchProps {
  id?: string
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
    onClick({
      ...event,
      active,
    })
  }

  return (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      <button
        id={id}
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
