import React, { memo } from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import Tooltip from '../tooltip'
import { TooltipTypes } from '../types/index'
import styles from './Switch.module.css'

interface SwitchProps {
  active: boolean
  disabled?: boolean
  onClick: (event: React.MouseEvent) => void
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
  return (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      <button
        type="button"
        role="switch"
        aria-checked={active}
        disabled={disabled}
        {...(typeof tooltip === 'string' && { 'aria-label': tooltip })}
        onClick={onClick}
        className={cx(styles.switch, { [styles.customColor]: color }, className)}
        {...(color && { style: { color } })}
      >
        <span className={styles.nib}></span>
      </button>
    </Tooltip>
  )
}

export default memo(Switch)
