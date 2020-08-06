import React from 'react'
import cx from 'classnames'
import styles from './ListItem.module.css'

type Props = {
  title: string
  editable?: boolean
  editing?: boolean
  checked?: boolean
  dirty?: boolean
  showActions?: boolean
  onClick?: () => void
  onToggle?: (toggle: boolean) => void
  onChange?: (value: string) => void
  onSave?: () => void
  onDelete?: () => void
}

const ListItem = ({
  title,
  editable = true,
  editing,
  checked,
  dirty,
  showActions = false,
  onClick,
  onToggle,
  onChange,
  onSave,
  onDelete,
}: Props) => {
  return (
    <li className={cx(styles.listItem, { [styles.showActions]: showActions })}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => {
          if (onToggle) onToggle(event.target.checked)
        }}
      />
      {editing && '✏️'}
      {dirty && '❋'}
      <input
        type="text"
        value={title}
        readOnly={!editable}
        onClick={() => {
          if (!showActions && onClick) onClick()
        }}
        onChange={(event) => {
          if (onChange) onChange(event.target.value)
        }}
        className={cx({ [styles.clickable]: !showActions && onClick })}
      />
      {showActions && (
        <div className={styles.actions}>
          <button
            className={cx({ dirty, done: !dirty })}
            onClick={() => {
              if (onSave) onSave()
            }}
          >
            save
          </button>
          <button>duplicate</button>
          <button
            onClick={() => {
              if (onDelete) onDelete()
            }}
          >
            delete
          </button>
        </div>
      )}
    </li>
  )
}

export default ListItem
