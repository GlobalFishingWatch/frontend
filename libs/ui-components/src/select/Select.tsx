import React, { MouseEvent, useCallback } from 'react'
import cx from 'classnames'
import { useSelect } from 'downshift'
import { Icon } from '../icon'
import { IconButton } from '../icon-button'
import { Tooltip } from '../tooltip'
import styles from './Select.module.css'
import { SelectOption, SelectOnChange } from './index'

interface SelectProps {
  id?: string
  label?: string
  error?: string
  placeholder?: string
  options: SelectOption[]
  selectedOption?: SelectOption
  onSelect: SelectOnChange
  onRemove?: SelectOnChange
  onCleanClick?: (e: React.MouseEvent) => void
  onToggleButtonClick?: (currentSelectedOption?: SelectOption) => void
  containerClassName?: string
  labelContainerClassName?: string
  className?: string
  direction?: 'bottom' | 'top'
  align?: 'left' | 'right'
  disabled?: boolean
  type?: 'primary' | 'secondary'
}

const isItemSelected = (selectedItem: SelectOption | undefined, item: SelectOption) => {
  return selectedItem !== undefined ? selectedItem.id === item.id : false
}

export function Select(props: SelectProps) {
  const {
    id,
    label = '',
    error = '',
    placeholder = 'Select an option',
    options,
    selectedOption,
    onSelect,
    onRemove,
    onCleanClick,
    containerClassName = '',
    labelContainerClassName = '',
    className = '',
    direction = 'bottom',
    align = 'left',
    disabled = false,
    onToggleButtonClick,
    type = 'primary',
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
    ...((id && { id }) || {}),
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
      {label && (
        <label className={cx(styles.label, labelContainerClassName)} {...getLabelProps()}>
          {label}
          {error && <span className={styles.errorLabel}>{error}</span>}
        </label>
      )}
      <div
        className={cx(
          styles.container,
          styles[type],
          { [styles.isOpen]: isOpen },
          { [styles.placeholderShown]: !selectedOption },
          { [styles.error]: error !== '' },
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
          {onCleanClick !== undefined && hasSelectedOptions && !disabled && (
            <IconButton icon="delete" size="small" onClick={onCleanClick}></IconButton>
          )}
          <IconButton
            icon={isOpen ? 'arrow-top' : 'arrow-down'}
            size="small"
            {...getToggleButtonProps()}
          ></IconButton>
        </div>
        <ul
          {...getMenuProps()}
          className={cx(styles.optionsContainer, styles[direction], styles[align])}
        >
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
                    <Icon
                      icon={selected ? 'close' : 'tick'}
                      className={cx(styles.icon, {
                        [styles.visible]: highlight && !itemDisabled && onRemove,
                      })}
                    />
                  </li>
                </Tooltip>
              )
            })}
        </ul>
      </div>
    </div>
  )
}
