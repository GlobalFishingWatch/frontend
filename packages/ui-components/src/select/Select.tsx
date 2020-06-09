import React from 'react'
import cx from 'classnames'
import { useSelect, useMultipleSelection } from 'downshift'
import Icon from '../icon'
import IconButton from '../icon-button'
import styles from './Select.module.css'
import { SelectOptionId, SelectOption } from './index'

interface SelectProps {
  label?: string
  placeholder?: string
  options: SelectOption[]
  selectedOptions: SelectOptionId[]
  onSelect: (option: SelectOption) => void
  onRemove: (option: SelectOption) => void
  onCleanClick?: (e: React.MouseEvent) => void
  className?: string
}

const Select: React.FC<SelectProps> = (props) => {
  const {
    label = '',
    placeholder = 'Select an option',
    options,
    selectedOptions,
    onSelect,
    onRemove,
    onCleanClick,
    className = '',
  } = props
  const { getDropdownProps } = useMultipleSelection({})
  const isItemSelected = (selectedItems: SelectOptionId[], item: SelectOption) => {
    return selectedItems !== null ? selectedItems.some((selected) => selected === item.id) : false
  }
  console.log('selectedOptions', selectedOptions)

  const handleChange = (item: SelectOption) => {
    if (item) {
      if (selectedOptions !== null && isItemSelected(selectedOptions, item)) {
        onRemove(item)
      } else {
        onSelect(item)
      }
    }
  }

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
  return (
    <div className={cx(styles.container, { [styles.isOpen]: isOpen }, className)}>
      <label {...getLabelProps()}>{label}</label>
      <div className={styles.placeholderContainer}>{placeholder}</div>
      <div className={styles.buttonsContainer}>
        {onCleanClick !== undefined && selectedOptions && selectedOptions.length > 0 && (
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
            return (
              <li
                className={cx(styles.optionItem, {
                  [styles.highlight]: highlightedIndex === index,
                })}
                key={`${item}${index}`}
                {...getItemProps({ item, index })}
              >
                {item.label}
                <Icon icon={isItemSelected(selectedOptions, item) ? 'close' : 'plus'} />
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export default Select
