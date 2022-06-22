import React, { ReactNode } from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import { Tooltip } from '../tooltip'
import { TooltipTypes } from '../types/types'
import { Icon } from '../icon'
import styles from './Checkbox.module.css'

interface CheckboxProps {
  active: boolean
  label?: string | ReactNode
  disabled?: boolean
  onClick: (event: React.MouseEvent) => void
  tooltip?: TooltipTypes
  tooltipPlacement?: Placement
  className?: string
  containerClassName?: string
  labelClassname?: string
}

export function Checkbox(props: CheckboxProps) {
  const {
    active = false,
    disabled = false,
    label,
    onClick,
    tooltip,
    tooltipPlacement = 'top',
    className,
    containerClassName,
    labelClassname,
  } = props
  return (
    <Tooltip content={tooltip as React.ReactNode} placement={tooltipPlacement}>
      <div
        className={cx(
          styles.container,
          { [styles.inline]: !label, [styles.disabled]: disabled },
          containerClassName
        )}
      >
        <button
          type="button"
          role="checkbox"
          aria-checked={active}
          disabled={disabled}
          {...(typeof tooltip === 'string' && { 'aria-label': tooltip })}
          onClick={onClick}
          className={cx(styles.Checkbox, className)}
        >
          <span className={styles.nib}>{active && <Icon icon="tick" />}</span>
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
