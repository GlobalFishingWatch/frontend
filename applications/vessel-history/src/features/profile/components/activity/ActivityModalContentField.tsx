import React, { Fragment, ReactNode } from 'react'
import styles from './ActivityModalContentField.module.css'

interface ActivityModalContentFieldProps {
  label: string
  value: string | ReactNode
}

const ActivityModalContentField: React.FC<ActivityModalContentFieldProps> = (
  props
): React.ReactElement => {
  const { label, value } = props
  return (
    <Fragment>
      <div className={styles.field}>
        <label className={styles.label}>{label}: </label>
        <span className={styles.value}>{value}</span>
      </div>
    </Fragment>
  )
}

export default ActivityModalContentField
