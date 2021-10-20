import React, { useCallback, memo } from 'react'
import cx from 'classnames'
import Tag from '../tag'
import styles from './TagList.module.css'
import { TagItem, TagListOnRemove } from './index'

interface TagListProps {
  className?: string
  color?: string
  tags: TagItem[]
  onRemove?: TagListOnRemove
}

function TagList(props: TagListProps) {
  const { className = '', color, tags = [], onRemove } = props
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
      {tags.map((tag) => (
        <li key={tag.id}>
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

export default memo(TagList)
