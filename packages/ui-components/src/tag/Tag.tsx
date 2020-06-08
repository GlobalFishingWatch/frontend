import React from 'react'
import cx from 'classnames'
import IconButton from '@globalfishingwatch/ui-components/src/icon-button'
import styles from './Tag.module.css'

interface TagProps {
  className?: string
  children: string
  color?: string
  onRemove: (event: React.MouseEvent) => void
}

const Tag: React.FC<TagProps> = (props) => {
  const { className, children, color, onRemove } = props
  return (
    <div
      className={cx(styles.Tag, { [styles.customColor]: color }, className)}
      {...(color && { style: { color: color } })}
    >
      <span className={styles.content}>{children}</span>
      <IconButton
        tooltip="Remove"
        className={styles.removeBtn}
        icon="close"
        size="tiny"
        onClick={onRemove}
      />
    </div>
  )
}

export default Tag
