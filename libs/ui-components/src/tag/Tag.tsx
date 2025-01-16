import React from 'react'
import cx from 'classnames'

import { IconButton } from '../icon-button'
import type { TooltipPlacement } from '../tooltip'
import { Tooltip } from '../tooltip'
import type { TooltipTypes } from '../types/types'

import styles from './Tag.module.css'

interface TagProps {
  className?: string
  children: string | React.ReactNode
  color?: string
  tooltip?: TooltipTypes
  tooltipPlacement?: TooltipPlacement
  testId?: string
  onRemove?: (event: React.MouseEvent) => void
}

export function Tag(props: TagProps) {
  const {
    className,
    children,
    color,
    onRemove,
    testId,
    tooltip = '',
    tooltipPlacement = 'top',
  } = props
  return (
    <Tooltip content={tooltip as React.ReactNode} placement={tooltipPlacement}>
      <div
        className={cx(styles.tag, { [styles.withRemove]: onRemove !== undefined }, className)}
        {...(color && { style: { color } })}
        {...(testId && { 'data-test': `${testId}` })}
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
