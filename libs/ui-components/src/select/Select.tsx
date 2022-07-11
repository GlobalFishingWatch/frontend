import React, { MouseEvent, useCallback } from 'react'
import cx from 'classnames'
import { useSelect } from 'downshift'
import { Icon } from '../icon'
import { IconButton } from '../icon-button'
import { Tooltip } from '../tooltip'
import styles from './Select.module.css'
import { SelectOption, SelectOnChange } from './index'

interface SelectProps {
  label?: string
  placeholder?: string
  options: SelectOption[]
  selectedOption?: SelectOption
  onSelect: SelectOnChange
  onRemove?: SelectOnChange
  onCleanClick?: (e: React.MouseEvent) => void
  onToggleButtonClick?: (currentSelectedOption?: SelectOption) => void
  containerClassName?: string
  className?: string
  direction?: 'bottom' | 'top'
  disabled?: boolean
}

const isItemSelected = (selectedItem: SelectOption | undefined, item: SelectOption) => {
  return selectedItem !== undefined ? selectedItem.id === item.id : false
}

export function Select(props: SelectProps) {
  const {
    label = '',
    placeholder = 'Select an option',
    options,
    selectedOption,
    onSelect,
    onRemove,
    onCleanClick,
    containerClassName = '',
    className = '',
    direction = 'bottom',
    disabled = false,
    onToggleButtonClick,
  } = props
  const {
    isOpen,
    selectItem,
    highlightedIndex,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
  } = useSelect<SelectOption | null>({
    items: options,
    onSelectedItemChange: ({ selectedItem }) => {
      if (!disabled && selectedItem && !selectedItem.disabled) {
        handleChange(selectedItem)
        selectItem(null)
      }
    },
  })

  const handleChange = useCallback(
    (option: SelectOption) => {
      if (onRemove && isItemSelected(selectedOption, option)) {
        onRemove(option)
      } else {
        onSelect(option)
      }
    },
    [onRemove, onSelect, selectedOption]
  )

  const handleToggleButtonClick = useCallback(
    (e: MouseEvent) => {
      if (onToggleButtonClick) onToggleButtonClick(selectedOption)
    },
    [onToggleButtonClick, selectedOption]
  )

  const hasSelectedOptions = selectedOption !== undefined

  const toggleButtonProps = getToggleButtonProps()

  return (
    <div className={containerClassName}>
      <label className={styles.label} {...getLabelProps()}>
        {label}
      </label>
      <div
        className={cx(
          styles.container,
          { [styles.isOpen]: isOpen },
          { [styles.placeholderShown]: !selectedOption },
          className
        )}
      >
        <div
          {...toggleButtonProps}
          className={styles.placeholderContainer}
          onClick={onToggleButtonClick ? handleToggleButtonClick : toggleButtonProps.onClick}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </div>
        <div className={styles.buttonsContainer}>
          {onCleanClick !== undefined && hasSelectedOptions && (
            <IconButton icon="delete" size="small" onClick={onCleanClick}></IconButton>
          )}
          <IconButton
            icon={isOpen ? 'arrow-top' : 'arrow-down'}
            size="small"
            {...getToggleButtonProps()}
          ></IconButton>
        </div>
        <ul {...getMenuProps()} className={cx(styles.optionsContainer, styles[direction])}>
          {isOpen &&
            options.length > 0 &&
            options.map((item, index) => {
              const highlight = highlightedIndex === index
              const selected = isItemSelected(selectedOption, item)
              const itemDisabled = disabled || item.disabled
              return (
                <Tooltip key={`${item}${index}`} content={item.tooltip} placement="top-start">
                  <li
                    className={cx(styles.optionItem, {
                      [styles.selected]: selected,
                      [styles.highlight]: highlight,
                      [styles.notAllowed]: itemDisabled,
                    })}
                    {...getItemProps({ item, index })}
                  >
                    {item.label}
                    {highlight && !itemDisabled && onRemove && (
                      <Icon icon={selected ? 'close' : 'tick'} />
                    )}
                  </li>
                </Tooltip>
              )
            })}
        </ul>
      </div>
    </div>
  )
}
