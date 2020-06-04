import React from 'react'
import cx from 'classnames'
import styles from './ListItem.module.css'

type Props = {
  title: string
  editing: boolean
  checked: boolean
  dirty: boolean
  showActions?: boolean
}

const ListItem = ({ title, editing, checked, dirty, showActions = false }: Props) => {
  return (
    <li className={cx(styles.listItem, { [styles.showActions]: showActions })}>
      <input type="checkbox" checked={checked} />
      {editing && '✏️'}
      <input type="text" value={title} disabled={!showActions} />
      {showActions && (
        <div className={styles.actions}>
          <button className={cx({ dirty, done: !dirty })}>save</button>
          <button>duplicate</button>
          <button>delete</button>
        </div>
      )}
    </li>
  )
}

export default ListItem
