import React, { Fragment, ReactNode } from 'react'
import cx from 'classnames'
import styles from './ActivityModalContentField.module.css'

interface ActivityModalContentFieldProps {
  className?: string
  label: string
  value: string | ReactNode
  help?: string | ReactNode
}

const ActivityModalContentField: React.FC<ActivityModalContentFieldProps> = ({
  className,
  label,
  value,
  help,
}: ActivityModalContentFieldProps): React.ReactElement => {
  return (
    <Fragment>
      <div className={cx(className, styles.field)}>
        <label className={styles.label}>{label}</label>
        <span className={styles.value}>{value}</span>
        <span className={styles.help}>{help}</span>
      </div>
    </Fragment>
  )
}

export default ActivityModalContentField
