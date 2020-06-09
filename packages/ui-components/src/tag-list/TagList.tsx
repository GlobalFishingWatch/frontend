import React, { useCallback } from 'react'
import cx from 'classnames'
import Tag from '@globalfishingwatch/ui-components/src/tag'
import styles from './TagList.module.css'
import { TagItemId, TagItem, TagListOnRemove } from './index'

interface TagListProps {
  className?: string
  color?: string
  options?: TagItem[]
  onRemove: TagListOnRemove
}

const TagList: React.FC<TagListProps> = (props) => {
  const { className = '', color, options = [], onRemove } = props
  const onRemoveTag = useCallback(
    (id: TagItemId) => {
      const currentOptions = options.filter((t) => t.id !== id)
      onRemove(id, currentOptions)
    },
    [onRemove, options]
  )

  return (
    <ul className={cx(styles.TagList, className)}>
      {options.map(({ id, label }) => (
        <li key={id}>
          <Tag onRemove={() => onRemoveTag(id)} {...(color && { color })}>
            {label}
          </Tag>
        </li>
      ))}
    </ul>
  )
}

export default TagList
