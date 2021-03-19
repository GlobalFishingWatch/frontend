import React, { memo, useLayoutEffect, useRef, useState } from 'react'
import cx from 'classnames'
import Button from '../button'
import styles from './Choice.module.css'
import { ChoiceOption } from '.'

interface ChoiceProps {
  options: ChoiceOption[]
  activeOption: string
  onOptionClick?: (option: ChoiceOption, e: React.MouseEvent) => void
  size?: 'default' | 'small'
}

function Choice({ activeOption, options, onOptionClick, size = 'default' }: ChoiceProps) {
  const activeOptionId = activeOption || options?.[0]?.id
  const [activeElementProperties, setActiveElementProperties] = useState<{
    width: number
    left: number
  }>({ width: 0, left: 0 })

  const activeRef = useRef<HTMLLIElement>()

  const onOptionClickHandle = (option: ChoiceOption, e: React.MouseEvent) => {
    activeRef.current = e.currentTarget.parentElement as HTMLLIElement
    setActiveElementProperties({
      width: activeRef?.current.clientWidth,
      left: activeRef?.current.offsetLeft,
    })
    onOptionClick && onOptionClick(option, e)
  }

  useLayoutEffect(() => {
    if (activeRef?.current) {
      setActiveElementProperties({
        width: activeRef?.current.clientWidth,
        left: activeRef?.current.offsetLeft,
      })
    }
  }, [activeRef])
  return (
    <div className={styles.Choice}>
      <ul className={styles.list} role="radiogroup">
        {options.map((option, index) => {
          const optionSelected = activeOptionId === option.id
          return (
            <li
              key={option.id}
              className={styles.option}
              role="radio"
              aria-controls={option.id}
              tabIndex={index}
              aria-checked={optionSelected}
              ref={optionSelected ? activeRef : undefined}
            >
              <Button
                className={cx(styles.optionButton, { [styles.optionActive]: optionSelected })}
                type="secondary"
                onClick={(e) => onOptionClickHandle(option, e)}
                size={size}
              >
                {option.title}
              </Button>
            </li>
          )
        })}
        <div
          className={styles.activeChip}
          style={{
            width: activeElementProperties.width,
            left: activeElementProperties.left,
          }}
        />
      </ul>
    </div>
  )
}

export default memo(Choice)
