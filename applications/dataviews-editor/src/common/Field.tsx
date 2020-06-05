import React from 'react'
import styles from './Field.module.css'

type Props = {
  fieldkey: string
  value: string
  keyEditable?: boolean
  onKeyChange?: (value: string) => void
  onValueChange?: (value: string) => void
}

const Field = ({ fieldkey, value, keyEditable = false, onKeyChange, onValueChange }: Props) => {
  return (
    <div className={styles.field}>
      <input
        className={styles.fieldkey}
        type="text"
        value={fieldkey}
        readOnly={!keyEditable}
        onChange={(event) => {
          if (onKeyChange) onKeyChange(event.target.value)
        }}
      />
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
