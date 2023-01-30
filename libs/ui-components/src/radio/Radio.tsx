'use client'

import React, { ReactElement } from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import { Tooltip } from '../tooltip'
import { TooltipTypes } from '../types/types'
import styles from './Radio.module.css'

interface RadioProps {
  active: boolean
  label?: string | ReactElement
  disabled?: boolean
  onClick: (event: React.MouseEvent) => void
  tooltip?: TooltipTypes
  tooltipPlacement?: Placement
  className?: string
  labelClassname?: string
}

export function Radio(props: RadioProps) {
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
    <Tooltip content={tooltip as React.ReactNode} placement={tooltipPlacement}>
      <div
        className={cx(styles.container, { [styles.inline]: !label, [styles.disabled]: disabled })}
      >
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
