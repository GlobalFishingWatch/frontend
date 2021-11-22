import React from 'react'
import cx from 'classnames'
import { Switch, SwitchProps } from '../switch'
import styles from './SwitchRow.module.css'

type SwitchRowProps = SwitchProps & {
  label: string
  className?: string
}

export function SwitchRow(props: SwitchRowProps) {
  const { label, className = '', ...rest } = props

  return (
    <div className={cx(styles.row, className)}>
      <Switch className={styles.switch} {...rest} />
      <label
        className={cx(styles.label, { [styles.labelDisabled]: rest.disabled })}
        onClick={rest.onClick as any}
      >
        {label}
      </label>
    </div>
  )
}
