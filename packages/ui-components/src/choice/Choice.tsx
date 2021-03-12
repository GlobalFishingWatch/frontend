import React, { memo } from 'react'
import cx from 'classnames'
import Button from '../button'
import styles from './Choice.module.css'
import { ChoiceOption } from '.'

interface ChoiceProps {
  options: ChoiceOption[]
  activeOption?: string
  onOptionClick?: (option: ChoiceOption, e: React.MouseEvent) => void
  size?: 'default' | 'small'
}

function Choice({ activeOption, options, onOptionClick, size = 'default' }: ChoiceProps) {
  const activeOptionId = activeOption || options?.[0]?.id
  const optionWidth = 100 / options.length
  const activeOptionLeft = options.findIndex((option) => option.id === activeOption) * optionWidth
  return (
    <ul className={styles.Choice} role="radiogroup">
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
          >
            <Button
              className={cx(styles.optionButton, { [styles.optionActive]: optionSelected })}
              type="secondary"
              onClick={(e) => onOptionClick && onOptionClick(option, e)}
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
          width: `calc(${optionWidth}% - 0.3rem)`,
          left: `calc(${activeOptionLeft}% + 0.2rem)`,
        }}
      />
    </ul>
  )
}

export default memo(Choice)
