import React, { useRef, forwardRef, useImperativeHandle, Ref } from 'react'
import cx from 'classnames'
import { IconButton } from '../icon-button'
import baseStyles from '../input-text/InputText.module.css'
import { InputSize } from '../input-text/InputText'
import styles from './InputDate.module.css'

export type InputDateProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string
  label?: string
  htmlLabel?: JSX.Element
  max?: string
  min?: string
  step?: number
  inputSize?: InputSize
  onRemove?: (e: React.MouseEvent) => void
}

const defaultKey = Date.now().toString()

function InputDateComponent(props: InputDateProps, forwardedRef: Ref<HTMLInputElement>) {
  const {
    className,
    value,
    label,
    htmlLabel,
    max,
    min,
    step,
    onRemove,
    inputSize = 'default',
    ...rest
  } = props
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement)

  const yymmddDate = value?.toString().slice(0, 10)

  const labelContent = htmlLabel || label

  return (
    <div className={cx(baseStyles.container, styles.container, styles[inputSize], className)}>
      {labelContent && <label htmlFor={label}>{labelContent}</label>}
      <input
        type="date"
        value={yymmddDate}
        key={label || defaultKey}
        className={styles.input}
        ref={inputRef}
        id={label}
        name={label}
        {...(max && { max })}
        {...(min && { min })}
        {...(step && { step })}
        {...rest}
      />
      <div className={styles.actionsContainer}>
        {onRemove && value && (
          <IconButton icon="delete" className={styles.action} onClick={onRemove} />
        )}
        <IconButton
          icon="calendar"
          type={!inputRef.current || inputRef.current.validity.valid ? 'default' : 'warning'}
        />
      </div>
    </div>
  )
}

export const InputDate = forwardRef<HTMLInputElement, InputDateProps>(InputDateComponent)
