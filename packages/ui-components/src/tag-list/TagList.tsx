import React from 'react'
import cx from 'classnames'
import Tag from '@globalfishingwatch/ui-components/src/tag'
import styles from './TagList.module.css'

interface TagListProps {
  className?: string
  color?: string
  options?: { name: string; value: string }[]
  onRemove: (value: string) => void
}

const TagList: React.FC<TagListProps> = (props) => {
  const { className, color, options = [], onRemove } = props
  const onRemoveTag = (value: string) => {
    onRemove(value)
  }

  return (
    <div
      className={cx(styles.TagList, { [styles.customColor]: color }, className)}
      {...(color && { style: { color: color } })}
    >
      {options.map((option) => (
        <Tag key={option.value} onRemove={() => onRemoveTag(option.value)}>
          {option.name}
        </Tag>
      ))}
    </div>
  )
}

export default TagList
