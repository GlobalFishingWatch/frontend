import React from 'react'

import styles from './ErrorPlaceholder.module.css'

const ErrorPlaceHolder = ({ title, children }: { title: string; children?: React.ReactNode }) => {
  return (
    <div className={styles.placeholder}>
      <div>
        <h2 className={styles.errorTitle}>{title}</h2>
        {children && children}
      </div>
    </div>
  )
}
export default ErrorPlaceHolder
