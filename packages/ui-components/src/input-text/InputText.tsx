import React from 'react'
import cx from 'classnames'
import Icon, { IconType } from '../icon'
import styles from './InputText.module.css'

export type InputSize = 'default' | 'small'

interface InputTextProps {
  disabled?: boolean
  className?: string
  placeholder: string
  label: string
  value?: string
  size?: InputSize
  icon?: IconType
}

const InputText: React.FC<InputTextProps> = (props) => {
  const { disabled = false, className, placeholder, value, size = 'default', label, icon } = props
  return (
    <div className={cx(styles.InputText, styles[size], className)}>
      <label htmlFor={label}>{label}</label>
      <input
        id={label}
        name={label}
        type="text"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
      />
      {icon && <Icon className={styles.icon} icon={icon} />}
    </div>
  )
}

export default InputText
