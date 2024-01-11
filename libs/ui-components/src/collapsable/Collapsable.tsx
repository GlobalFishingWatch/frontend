import React, { ReactNode } from 'react'
import cx from 'classnames'
import { Icon } from '../icon'
import styles from './Collapsable.module.css'

interface CollapsableProps {
  open?: boolean
  label?: string | ReactNode
  children?: string | ReactNode
  className?: string
}

export function Collapsable(props: CollapsableProps) {
  const { open = true, label, className, children } = props
  return (
    <details open={open} className={cx(styles.details, className)}>
      <summary className={styles.summary}>
        <span className={styles.label}>{label}</span>
        <Icon className={styles.icon} icon="arrow-down" />
      </summary>
      {children}
    </details>
  )
}
