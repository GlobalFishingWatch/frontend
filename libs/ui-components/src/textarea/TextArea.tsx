import React from 'react'
import cx from 'classnames'

import styles from './TextArea.module.css'

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id?: string
  name?: string
  labelClassName?: string
  className?: string
  label?: string
}

export function TextArea(props: TextAreaProps) {
  const { className, labelClassName = '', label, value, ...rest } = props
  const inputProps = {
    id: label,
    name: rest.id ?? label,
    ...rest,
  }
  return (
    <div className={cx(styles.container, className)}>
      {label && (
        <label className={labelClassName} htmlFor={inputProps.id}>
          {label}
        </label>
      )}
      <textarea className={styles.textarea} value={value} {...inputProps} />
    </div>
  )
}
