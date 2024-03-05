import React, { useRef, forwardRef, useImperativeHandle, Ref, Fragment } from 'react'
import cx from 'classnames'
import { IconButton } from '../icon-button'
import { Tooltip } from '../tooltip'
import { Icon } from '../icon'
import { Spinner } from '../spinner'
import { TooltipTypes } from '../types/types'
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
  invalid?: boolean
  invalidTooltip?: TooltipTypes
  testId?: string
  onCleanButtonClick?: (e: React.MouseEvent<Element>) => void
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
    invalid = false,
    invalidTooltip,
    testId,
    onCleanButtonClick,
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
        <label className={cx(styles.labelContainer, labelClassName)} htmlFor={inputProps.id}>
          {label}
          {invalid && invalidTooltip && (
            <Tooltip content={invalidTooltip as React.ReactNode}>
              <span className={styles.invalidTooltipIcon}>
                <Icon icon="warning" type="warning" />
              </span>
            </Tooltip>
          )}
        </label>
      )}
      <input
        className={cx(styles.input, { [styles.invalid]: invalid })}
        key={inputKey}
        ref={inputRef}
        type={type}
        {...(testId && { 'data-test': testId })}
        {...inputProps}
      />
      {loading && <Spinner size="tiny" className={styles.spinner} />}
      {!loading && onCleanButtonClick && inputProps.value && (
        <IconButton
          icon="delete"
          size="medium"
          className={styles.delete}
          onClick={onCleanButtonClick}
        />
      )}
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
