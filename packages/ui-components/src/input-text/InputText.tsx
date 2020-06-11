import React, { useRef, forwardRef, useImperativeHandle } from 'react'
import cx from 'classnames'
import Icon from '../icon'
import styles from './InputText.module.css'

export type InputSize = 'default' | 'small'
export type InputType = 'text' | 'email' | 'search'

type InputTextProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string
  label?: string
  type?: InputType
  inputSize?: InputSize
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>((props, forwardedRef) => {
  const { className, label, type = 'text', inputSize = 'default', ...rest } = props
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement)

  return (
    <div className={cx(styles.InputText, styles[inputSize], className)}>
      {label && <label htmlFor={label}>{label}</label>}
      <input ref={inputRef} id={label} name={label} type={type} {...rest} />
      {type !== 'text' && (
        <Icon
          icon={type}
          className={styles.icon}
          type={!inputRef.current || inputRef.current.validity.valid ? 'default' : 'warning'}
        />
      )}
    </div>
  )
})

export default InputText
