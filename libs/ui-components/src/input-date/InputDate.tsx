import type { JSX,Ref } from 'react'
import React, { forwardRef, useImperativeHandle,useRef } from 'react'
import cx from 'classnames'

import { IconButton } from '../icon-button'
import type { InputSize } from '../input-text/InputText'

import baseStyles from '../input-text/InputText.module.css'
import styles from './InputDate.module.css'

export type InputDateProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id?: string
  name?: string
  className?: string
  invalid?: boolean
  label?: string
  htmlLabel?: JSX.Element
  max?: string
  min?: string
  step?: number
  type?: 'month' | 'date' | 'datetime-local'
  inputSize?: InputSize
  onRemove?: (e: React.MouseEvent) => void
}

const defaultKey = Date.now().toString()

function InputDateComponent(props: InputDateProps, forwardedRef: Ref<HTMLInputElement>) {
  const {
    id,
    className,
    value,
    label,
    htmlLabel,
    max,
    min,
    step,
    onRemove,
    inputSize = 'default',
    type = 'date',
    invalid,
    ...rest
  } = props
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement)

  const yymmddDate = value?.toString().slice(0, 10)

  const labelContent = htmlLabel || label

  const isInvalid = props.invalid === true || inputRef.current?.validity.valid === false

  const inputProps = {
    id: id ?? label,
    name: id ?? label,
    ...(max && { max }),
    ...(min && { min }),
    ...(step && { step }),
    ...rest,
  }
  return (
    <div className={cx(baseStyles.container, styles.container, styles[inputSize], className)}>
      {labelContent && <label htmlFor={inputProps.id}>{labelContent}</label>}
      <input
        type={type}
        value={yymmddDate}
        className={cx(styles.input, { [styles.invalid]: isInvalid })}
        ref={inputRef}
        {...inputProps}
        key={label || defaultKey}
      />
      <div className={styles.actionsContainer}>
        {onRemove && value && (
          <IconButton icon="delete" className={styles.action} onClick={onRemove} />
        )}
        <IconButton icon="calendar" type={invalid ? 'warning' : 'default'} />
      </div>
    </div>
  )
}

export const InputDate = forwardRef<HTMLInputElement, InputDateProps>(InputDateComponent)
