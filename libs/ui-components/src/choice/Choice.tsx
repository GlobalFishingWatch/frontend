import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import cx from 'classnames'

import type { ButtonSize } from '../button'
import { Button } from '../button'
import { IconButton } from '../icon-button'
import type { SelectOption } from '../select'
import { Tooltip } from '../tooltip'

import styles from './Choice.module.css'

export type ChoiceOption<Option = string> = SelectOption<Option>

type ActiveChoiceProperties = {
  width: number
  left: number
}

interface ChoiceProps {
  options: ChoiceOption[]
  activeOption?: string
  disabled?: boolean
  onSelect?: (option: ChoiceOption<any>, e: React.MouseEvent) => void
  size?: ButtonSize
  className?: string
  testId?: string
  label?: string
  infoTooltip?: string
}

export function Choice({
  activeOption,
  options,
  disabled,
  onSelect,
  size = 'default',
  className = '',
  testId,
  label,
  infoTooltip,
}: ChoiceProps) {
  const activeOptionId = activeOption

  const activeRef = useRef<HTMLLIElement | null>(null)
  const [activeElementProperties, setActiveElementProperties] = useState<
    ActiveChoiceProperties | undefined
  >()

  const onOptionClickHandle = (option: ChoiceOption, e: React.MouseEvent) => {
    if (activeOptionId === option.id) return
    activeRef.current = e.currentTarget.parentElement as HTMLLIElement
    setActiveElementProperties({
      width: activeRef?.current.clientWidth,
      left: activeRef?.current.offsetLeft,
    })
    if (onSelect) {
      onSelect(option, e)
    }
  }

  const updateActiveElementPoperties = useCallback(() => {
    if (activeRef?.current?.clientWidth) {
      setActiveElementProperties({
        width: activeRef?.current.clientWidth,
        left: activeRef?.current.offsetLeft,
      })
    }
  }, [])

  useLayoutEffect(() => {
    updateActiveElementPoperties()
  }, [activeRef, activeOptionId, updateActiveElementPoperties])

  useEffect(() => {
    if (!activeRef.current) return
    const resizeObserver = new ResizeObserver(updateActiveElementPoperties)
    resizeObserver.observe(activeRef.current)
    return () => resizeObserver.disconnect()
  }, [updateActiveElementPoperties])

  if (!options?.length) {
    return null
  }

  return (
    <div>
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
      <div className={cx(styles.Choice, className)}>
        <ul className={styles.list} role="radiogroup" {...(testId && { 'data-test': `${testId}` })}>
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
          {activeOption && activeElementProperties && (
            <div
              className={styles.activeChip}
              style={{
                width: activeElementProperties.width,
                left: activeElementProperties.left,
              }}
            />
          )}
        </ul>
      </div>
    </div>
  )
}
