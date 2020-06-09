import React, { useCallback } from 'react'
import cx from 'classnames'
import { useSelect, useMultipleSelection } from 'downshift'
import Icon from '../icon'
import IconButton from '../icon-button'
import Tooltip from '../tooltip'
import TagList from '../tag-list'
import styles from './Select.module.css'
import { SelectOption, SelectOnChange } from './index'

interface SelectProps {
  label?: string
  placeholder?: string
  options: SelectOption[]
  selectedOptions?: SelectOption[]
  onSelect: SelectOnChange
  onRemove: SelectOnChange
  onCleanClick?: (e: React.MouseEvent) => void
  className?: string
}

const isItemSelected = (selectedItems: SelectOption[], item: SelectOption) => {
  return selectedItems !== null ? selectedItems.some((selected) => selected.id === item.id) : false
}

const Select: React.FC<SelectProps> = (props) => {
  const {
    label = '',
    placeholder = 'Select an option',
    options,
    selectedOptions = [],
    onSelect,
    onRemove,
    onCleanClick,
    className,
  } = props
  const { getDropdownProps } = useMultipleSelection({})
  const {
    isOpen,
    highlightedIndex,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
  } = useSelect({
    items: options,
    onStateChange: ({ type, selectedItem }) => {
      switch (type) {
        case useSelect.stateChangeTypes.MenuKeyDownEnter:
        case useSelect.stateChangeTypes.MenuKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
        case useSelect.stateChangeTypes.MenuBlur:
          if (selectedItem) {
            handleChange(selectedItem)
          }
          break
        default:
          break
      }
    },
  })

  const handleRemove = useCallback(
    (option: SelectOption) => {
      const newOptions = selectedOptions.filter((selectedOption) => selectedOption.id !== option.id)
      onRemove(option, newOptions)
    },
    [onRemove, selectedOptions]
  )

  const handleSelect = useCallback(
    (option: SelectOption) => {
      const newOptions = [...selectedOptions, option]
      onSelect(option, newOptions)
    },
    [onSelect, selectedOptions]
  )

  const handleChange = useCallback(
    (option: SelectOption) => {
      if (selectedOptions !== null && isItemSelected(selectedOptions, option)) {
        handleRemove(option)
      } else {
        handleSelect(option)
      }
    },
    [handleRemove, handleSelect, selectedOptions]
  )
  const hasSelectedOptions = selectedOptions && selectedOptions.length > 0
  return (
    <div className={cx(styles.container, { [styles.isOpen]: isOpen }, className)}>
      <label {...getLabelProps()}>{label}</label>
      <div className={styles.placeholderContainer}>
        {hasSelectedOptions ? (
          <TagList tags={selectedOptions} onRemove={handleRemove} />
        ) : (
          placeholder
        )}
      </div>
      <div className={styles.buttonsContainer}>
        {onCleanClick !== undefined && hasSelectedOptions && (
          <IconButton icon="delete" size="small" onClick={onCleanClick}></IconButton>
        )}
        <IconButton
          icon={isOpen ? 'arrow-top' : 'arrow-down'}
          size="small"
          {...getToggleButtonProps(getDropdownProps({ preventKeyAction: isOpen }))}
        ></IconButton>
      </div>
      <ul {...getMenuProps()} className={styles.optionsContainer}>
        {isOpen &&
          options.length > 0 &&
          options.map((item, index) => {
            const highlight = highlightedIndex === index
            return (
              <Tooltip content={item.tooltip} placement="top-start">
                <li
                  className={cx(styles.optionItem, {
                    [styles.highlight]: highlight,
                  })}
                  key={`${item}${index}`}
                  {...getItemProps({ item, index })}
                >
                  {item.label}
                  {highlight && (
                    <Icon icon={isItemSelected(selectedOptions, item) ? 'close' : 'tick'} />
                  )}
                </li>
              </Tooltip>
            )
          })}
      </ul>
    </div>
  )
}

export default Select
