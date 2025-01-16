/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */

import type { ReactNode } from 'react'
import React from 'react'
import cx from 'classnames'

import { Icon } from '../icon'
import type { TooltipPlacement } from '../tooltip'
import { Tooltip } from '../tooltip'
import type { TooltipTypes } from '../types/types'

import styles from './Checkbox.module.css'

interface CheckboxProps {
  active: boolean
  label?: string | ReactNode
  disabled?: boolean
  onClick: (event: React.MouseEvent) => void
  tooltip?: TooltipTypes
  tooltipPlacement?: TooltipPlacement
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
            role="button"
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
