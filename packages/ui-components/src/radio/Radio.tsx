import React, { memo } from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import Tooltip from '../tooltip'
import styles from './Radio.module.css'

interface RadioProps {
  active: boolean
  label?: string
  disabled?: boolean
  onClick: (event: React.MouseEvent) => void
  tooltip?: React.ReactChild | React.ReactChild[] | string
  tooltipPlacement?: Placement
  className?: string
  labelClassname?: string
}

function Radio(props: RadioProps) {
  const {
    active = false,
    disabled = false,
    label,
    onClick,
    tooltip,
    tooltipPlacement = 'top',
    className,
    labelClassname,
  } = props
  return (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      <div className={cx(styles.container, { [styles.inline]: !label })}>
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
        {label && (
          <label
            onClick={onClick}
            className={cx(styles.Label, { [styles.active]: active }, labelClassname)}
          >
            {label}
          </label>
        )}
      </div>
    </Tooltip>
  )
}

export default memo(Radio)
