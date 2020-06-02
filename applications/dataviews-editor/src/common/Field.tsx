import React from 'react'
import styles from './Field.module.css'

type Props = {
  fieldkey: string
  value: string
  keyEditable?: boolean
}

const Field = ({ fieldkey, value, keyEditable = false }: Props) => {
  return <div className={styles.field}>
    <input className={styles.fieldkey} type="text" value={fieldkey} disabled={!keyEditable} />
    <input className={styles.value} type="text" value={value} />
  </div>
}

export default Field