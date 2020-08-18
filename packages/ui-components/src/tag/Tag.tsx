import React, { memo } from 'react'
import cx from 'classnames'
import IconButton from '@globalfishingwatch/ui-components/src/icon-button'
import styles from './Tag.module.css'

interface TagProps {
  className?: string
  children: string
  color?: string
  onRemove?: (event: React.MouseEvent) => void
}

function Tag(props: TagProps) {
  const { className, children, color, onRemove } = props
  return (
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
  )
}

export default memo(Tag)
