'use client'

import React, { useRef, forwardRef, useImperativeHandle, Ref } from 'react'
import cx from 'classnames'
import { Icon } from '../icon'
import { Spinner } from '../spinner'
import styles from './InputText.module.css'

export type InputSize = 'default' | 'small'
export type InputType = 'text' | 'email' | 'search' | 'number'

type InputTextProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id?: string
  name?: string
  labelClassName?: string
  className?: string
  label?: string
  type?: InputType
  step?: string
  inputSize?: InputSize
  inputKey?: string
  loading?: boolean
}

const defaultKey = Date.now().toString()

function InputTextComponent(props: InputTextProps, forwardedRef: Ref<HTMLInputElement>) {
  const {
    id,
    className,
    labelClassName = '',
    label,
    type = 'text',
    step = 'any',
    inputSize = 'default',
    inputKey = defaultKey,
    loading = false,
    ...rest
  } = props
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement)

  const inputProps = {
    id: id ?? label,
    name: id ?? label,
    ...rest,
    ...(type === 'number' && { step }),
  }
  return (
    <div className={cx(styles.container, styles[inputSize], className)}>
      {label && (
        <label className={labelClassName} htmlFor={inputProps.id}>
          {label}
        </label>
      )}
      <input className={styles.input} key={inputKey} ref={inputRef} type={type} {...inputProps} />
      {loading && <Spinner size="tiny" className={styles.spinner} />}
      {!loading && (type === 'email' || type === 'search') && (
        <Icon
          icon={type}
          className={styles.icon}
          type={!inputRef.current || inputRef.current.validity.valid ? 'default' : 'warning'}
        />
      )}
    </div>
  )
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(InputTextComponent)
