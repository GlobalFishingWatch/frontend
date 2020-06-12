import React, { useCallback } from 'react'
import cx from 'classnames'
import Tag from '@globalfishingwatch/ui-components/src/tag'
import styles from './TagList.module.css'
import { TagItem, TagListOnRemove } from './index'

interface TagListProps {
  className?: string
  color?: string
  tags: TagItem[]
  onRemove?: TagListOnRemove
}

const TagList: React.FC<TagListProps> = (props) => {
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
          <Tag onRemove={() => onRemoveTag(tag)} {...(color && { color })}>
            {tag.label}
          </Tag>
        </li>
      ))}
    </ul>
  )
}

export default TagList
