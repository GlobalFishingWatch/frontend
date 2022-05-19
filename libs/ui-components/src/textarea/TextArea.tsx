import React, { useRef, forwardRef, useImperativeHandle, Ref } from 'react'
import cx from 'classnames'
import styles from './TextArea.module.css'

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  labelClassName?: string
  className?: string
  label?: string
}

function TextAreaComponent(props: TextAreaProps) {
  const { className, labelClassName = '', label, value, ...rest } = props
  //   const inputRef = useRef<HTMLInputElement>(null)
  //   useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement)
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

export const TextArea = forwardRef<HTMLInputElement, TextAreaProps>(TextAreaComponent)
