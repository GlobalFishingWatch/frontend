import React from 'react'
import cx from 'classnames'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Button } from '@globalfishingwatch/ui-components'

import styles from './VisualisationChoice.module.css'

interface VisualisationChoiceProps {
  options: ChoiceOption[]
  activeOption?: string
  onSelect?: (option: ChoiceOption<any>, e: React.MouseEvent) => void
  className?: string
  testId?: string
}

export function VisualisationChoice({
  activeOption,
  options,
  onSelect,
  className = '',
  testId,
}: VisualisationChoiceProps) {
  const onOptionClickHandle = (option: ChoiceOption, e: React.MouseEvent) => {
    if (onSelect) {
      onSelect(option, e)
    }
  }

  if (!options?.length) {
    return null
  }

  return (
    <div className={cx(styles.VisualisationChoice, className, 'print-hidden')}>
      <ul className={styles.list} role="radiogroup" {...(testId && { 'data-test': `${testId}` })}>
        {options.map((option) => {
          const optionSelected = activeOption === option.id
          const optionCollapsable =
            activeOption === 'positions'
              ? option.id !== 'positions' && option.id !== 'heatmap'
              : activeOption !== option.id && option.id !== 'positions'
          return (
            <li
              key={option.id}
              className={styles.option}
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
              role="radio"
              aria-checked={optionSelected}
            >
              <Button
                disabled={option.disabled}
                className={cx(styles.optionButton, {
                  [styles.optionCollapsable]: optionCollapsable,
                  [styles.optionActive]: optionSelected,
                  [styles.disabled]: option.disabled,
                })}
                tooltip={option.tooltip}
                tooltipPlacement={option.tooltipPlacement}
                type="secondary"
                testId={testId && `${testId}-${option.id}`}
                onClick={(e) => !option.disabled && onOptionClickHandle(option, e)}
              >
                {option.label}
              </Button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
