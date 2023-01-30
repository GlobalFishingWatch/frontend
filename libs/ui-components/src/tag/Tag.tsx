'use client'

import React from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import { IconButton } from '../icon-button'
import { Tooltip } from '../tooltip'
import { TooltipTypes } from '../types/types'
import styles from './Tag.module.css'

interface TagProps {
  className?: string
  children: string | React.ReactNode
  color?: string
  tooltip?: TooltipTypes
  tooltipPlacement?: Placement
  onRemove?: (event: React.MouseEvent) => void
}

export function Tag(props: TagProps) {
  const { className, children, color, onRemove, tooltip = '', tooltipPlacement = 'auto' } = props
  return (
    <Tooltip content={tooltip as React.ReactNode} placement={tooltipPlacement}>
      <div
        className={cx(styles.tag, { [styles.withRemove]: onRemove !== undefined }, className)}
        {...(color && { style: { color } })}
      >
        <span className={styles.content}>{children}</span>
        {onRemove !== undefined && (
          <IconButton
            tooltip="Remove"
            tooltipPlacement="top"
            className={styles.removeBtn}
            icon="close"
            size="tiny"
            onClick={onRemove}
            aria-label={`Remove ${children}`}
          />
        )}
      </div>
    </Tooltip>
  )
}
