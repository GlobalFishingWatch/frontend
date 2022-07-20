import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Placement } from 'tippy.js'
import cx from 'classnames'
import { TooltipTypes } from '..'
import { Button } from '../button'
import styles from './Choice.module.css'

export interface ChoiceOption {
  id: string
  title: string
  disabled?: boolean
  tooltip?: TooltipTypes
  tooltipPlacement?: Placement
}

type ActiveChoiceProperties = {
  width: number
  left: number
}

interface ChoiceProps {
  options: ChoiceOption[]
  activeOption: string
  disabled?: boolean
  onOptionClick?: (option: ChoiceOption, e: React.MouseEvent) => void
  size?: 'default' | 'small' | 'tiny'
  className?: string
}

export function Choice({
  activeOption,
  options,
  disabled,
  onOptionClick,
  size = 'default',
  className = '',
}: ChoiceProps) {
  const activeOptionId = activeOption || options?.[0]?.id

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
    onOptionClick && onOptionClick(option, e)
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

  // Workaround to ensure the activeElement has the clientWidth ready
  useEffect(() => {
    setTimeout(updateActiveElementPoperties, 500)
    window.addEventListener('resize', updateActiveElementPoperties)
    return () => {
      window.removeEventListener('resize', updateActiveElementPoperties)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, updateActiveElementPoperties])

  return (
    <div className={cx(styles.Choice, className)}>
      <ul className={styles.list} role="radiogroup">
        {options.map((option, index) => {
          const optionSelected = activeOptionId === option.id
          return (
            <li
              key={option.id}
              className={styles.option}
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
                onClick={(e) => !option.disabled && onOptionClickHandle(option, e)}
                size={size}
              >
                {option.title}
              </Button>
            </li>
          )
        })}
        {activeElementProperties && (
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
  )
}
