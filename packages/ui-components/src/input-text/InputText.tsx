import React, { useRef } from 'react'
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

const InputText: React.FC<InputTextProps> = (props) => {
  const {
    className,
    placeholder,
    value,
    inputSize = 'default',
    label,
    type = 'text',
    onChange,
    ...rest
  } = props
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={cx(styles.InputText, styles[inputSize], className)}>
      {label && <label htmlFor={label}>{label}</label>}
      <input
        ref={inputRef}
        id={label}
        name={label}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {type !== 'text' && (
        <Icon
          icon={type}
          className={styles.icon}
          type={!inputRef.current || inputRef.current.validity.valid ? 'default' : 'warning'}
        />
      )}
    </div>
  )
}

export default InputText
