import React, { useCallback } from 'react'
import cx from 'classnames'

import { Tag } from '../tag'

import type { TagItem, TagListOnRemove } from './index'

import styles from './TagList.module.css'

interface TagListProps {
  className?: string
  color?: string
  tags: TagItem[]
  testId?: string
  onRemove?: TagListOnRemove
}

export function TagList(props: TagListProps) {
  const { className = '', color, tags = [], testId, onRemove } = props
  const onRemoveTag = useCallback(
    (tag: TagItem) => {
      if (onRemove) {
        const netTags = tags.filter((t) => t.id !== tag.id)
        onRemove(tag, netTags)
      }
    },
    [onRemove, tags]
  )

  return (
    <ul className={cx(styles.tagList, className)}>
      {tags.map((tag, index) => (
        <li key={tag.id || index} {...(testId && { 'data-test': `${testId}-${tag.id}` })}>
          <Tag
            tooltip={tag.tooltip}
            tooltipPlacement={tag.tooltipPlacement}
            onRemove={onRemove ? () => onRemoveTag(tag) : undefined}
            {...(color && { color })}
          >
            {tag.label}
          </Tag>
        </li>
      ))}
    </ul>
  )
}
