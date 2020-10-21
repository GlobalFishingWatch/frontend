import React, { memo } from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import Tooltip from '../tooltip'
import styles from './Radio.module.css'

interface RadioProps {
  active: boolean
  disabled?: boolean
  onClick: (event: React.MouseEvent) => void
  tooltip?: React.ReactChild | React.ReactChild[] | string
  tooltipPlacement?: Placement
  className?: string
}

function Radio(props: RadioProps) {
  const {
    active = false,
    disabled = false,
    onClick,
    tooltip,
    tooltipPlacement = 'top',
    className,
  } = props
  return (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      <button
        type="button"
        role="radio"
        aria-checked={active}
        disabled={disabled}
        {...(typeof tooltip === 'string' && { 'aria-label': tooltip })}
        onClick={onClick}
        className={cx(styles.Radio, className)}
      >
        <span className={styles.nib}></span>
      </button>
    </Tooltip>
  )
}

export default memo(Radio)
