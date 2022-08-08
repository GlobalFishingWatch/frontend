import React from 'react'
import cx from 'classnames'
import styles from './TextArea.module.css'

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  labelClassName?: string
  className?: string
  label?: string
}

export function TextArea(props: TextAreaProps) {
  const { className, labelClassName = '', label, value, ...rest } = props

  return (
    <div className={cx(styles.container, className)}>
      {label && (
        <label className={labelClassName} htmlFor={label}>
          {label}
        </label>
      )}
      <textarea className={styles.textarea} id={label} name={label} value={value} {...rest} />
    </div>
  )
}
