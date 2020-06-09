import React from 'react'
import styles from './Field.module.css'

type Props = {
  fieldkey: string
  value: string
  keyEditable?: boolean
  onValueChange?: (value: string) => void
}

const Field = ({ fieldkey, value, onValueChange }: Props) => {
  return (
    <div className={styles.field}>
      <div className={styles.fieldkey}>{fieldkey}</div>
      <input
        className={styles.value}
        type="text"
        value={value}
        onChange={(event) => {
          if (onValueChange) onValueChange(event.target.value)
        }}
      />
    </div>
  )
}

export default Field
