import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import cx from 'classnames'

import type { ButtonSize } from '../button'
import { Button } from '../button'
import { IconButton } from '../icon-button'
import type { SelectOption } from '../select'
import { Select } from '../select'
import { Tooltip } from '../tooltip'

import styles from './Choice.module.css'

export type ChoiceOption<Option = string> = SelectOption<Option>

interface ChoiceProps {
  options: ChoiceOption[]
  activeOption?: string
  disabled?: boolean
  onSelect?: (option: ChoiceOption<any>, e: React.MouseEvent) => void
  size?: ButtonSize
  className?: string
  containerClassName?: string
  testId?: string
  label?: string
  infoTooltip?: string
}

export function Choice({
  activeOption: activeOptionId,
  options,
  disabled,
  onSelect,
  size = 'default',
  className = '',
  containerClassName = '',
  testId,
  label,
  infoTooltip,
}: ChoiceProps) {
  const activeRef = useRef<HTMLLIElement | null>(null)
  const measureRef = useRef<HTMLUListElement | null>(null)
  const choiceRef = useRef<HTMLDivElement | null>(null)
  const [pill, setPill] = useState<{ width: number; left: number } | null>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  const measurePill = useCallback(() => {
    if (activeRef.current) {
      setPill({
        width: activeRef.current.offsetWidth,
        left: activeRef.current.offsetLeft,
      })
    }
  }, [])

  const checkOverflow = useCallback(() => {
    const measure = measureRef.current
    const choice = choiceRef.current
    if (!measure || !choice) return
    setIsOverflowing(measure.scrollWidth > choice.clientWidth)
  }, [])

  useLayoutEffect(() => {
    measurePill()
    checkOverflow()
  }, [activeOptionId, measurePill, checkOverflow, isOverflowing])

  useEffect(() => {
    const measure = measureRef.current
    const choice = choiceRef.current
    if (!measure || !choice) return
    const observer = new ResizeObserver(() => {
      measurePill()
      checkOverflow()
    })
    observer.observe(measure)
    observer.observe(choice)
    return () => observer.disconnect()
  }, [measurePill, checkOverflow, options.length])

  const onOptionClickHandle = (option: ChoiceOption, e: React.MouseEvent) => {
    if (activeOptionId === option.id) return
    activeRef.current = e.currentTarget.parentElement as HTMLLIElement
    onSelect?.(option, e)
  }

  const selectOptions = useMemo(
    () => options.map((o) => ({ ...o, label: <label>{o.label}</label> })),
    [options]
  )

  if (!options?.length) {
    return null
  }

  return (
    <div className={containerClassName}>
      {label && (
        <label className={styles.label}>
          {label}
          {infoTooltip && (
            <Tooltip content={infoTooltip}>
              <IconButton icon="info" size="tiny" className={styles.infoIcon} />
            </Tooltip>
          )}
        </label>
      )}
      <div ref={choiceRef} className={cx(styles.Choice, className)}>
        {/* Always-hidden overflow measurement list — flex: none on items via CSS */}
        <ul ref={measureRef} className={cx(styles.list, styles.listHidden)} aria-hidden="true">
          {options.map((option) => (
            <li key={option.id} className={styles.option}>
              <Button className={styles.optionButton} type="secondary" size={size}>
                {option.label}
              </Button>
            </li>
          ))}
        </ul>
        {isOverflowing ? (
          <Select
            className={styles.selectFallback}
            options={selectOptions}
            selectedOption={selectOptions.find((o) => o.id === activeOptionId)}
            onSelect={(option) => onSelect?.(option as ChoiceOption, {} as React.MouseEvent)}
            disabled={disabled}
            testId={testId}
          />
        ) : (
          <ul className={styles.list} role="radiogroup" {...(testId && { 'data-testid': testId })}>
            {pill && (
              <span
                className={cx(styles.activePill)}
                style={{ width: pill.width, transform: `translateX(${pill.left}px)` }}
                aria-hidden="true"
              />
            )}
            {options.map((option) => {
              const optionSelected = activeOptionId === option.id
              return (
                <li
                  key={option.id}
                  className={styles.option}
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                  role="radio"
                  aria-checked={optionSelected}
                  ref={optionSelected ? activeRef : null}
                >
                  <Button
                    disabled={disabled || option.disabled}
                    className={cx(styles.optionButton, {
                      [styles.optionActive]: optionSelected,
                      [styles.disabled]: disabled || option.disabled,
                    })}
                    tooltip={option.tooltip}
                    tooltipPlacement={option.tooltipPlacement}
                    type="secondary"
                    testId={testId && `${testId}-${option.id}`}
                    onClick={(e) => !option.disabled && onOptionClickHandle(option, e)}
                    size={size}
                  >
                    {option.label}
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
