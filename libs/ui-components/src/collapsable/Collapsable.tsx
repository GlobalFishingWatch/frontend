import type { ReactNode } from 'react'
import React from 'react'
import cx from 'classnames'

import { Icon } from '../icon'

import styles from './Collapsable.module.css'

interface CollapsableProps {
  id?: string
  open?: boolean
  label?: string | ReactNode
  children?: string | ReactNode
  className?: string
  labelClassName?: string
  onToggle?: (isOpen: boolean, id?: string) => void
}

export function Collapsable(props: CollapsableProps) {
  const { id, open = true, label, className, labelClassName, children, onToggle } = props

  const handleToggle = (e: any) => {
    e.stopPropagation()
    if (onToggle) {
      onToggle(e.nativeEvent.newState === 'open', id)
    }
  }

  return (
    <details id={id} open={open} className={styles.details} onToggle={handleToggle}>
      <summary className={cx(styles.summary, className)}>
        <span className={cx(styles.label, labelClassName)}>
          {label}
          <Icon className={cx(styles.icon, 'print-hidden')} icon="arrow-down" />
        </span>
      </summary>
      {children}
    </details>
  )
}
