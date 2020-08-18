import React, { memo, useCallback } from 'react'
import cx from 'classnames'
import { useSelect } from 'downshift'
import Icon from '../icon'
import IconButton from '../icon-button'
import Tooltip from '../tooltip'
import styles from './Select.module.css'
import { SelectOption, SelectOnChange } from './index'

interface SelectProps {
  label?: string
  placeholder?: string
  options: SelectOption[]
  selectedOption?: SelectOption
  onSelect: SelectOnChange
  onRemove: SelectOnChange
  onCleanClick?: (e: React.MouseEvent) => void
  className?: string
}

const isItemSelected = (selectedItem: SelectOption | undefined, item: SelectOption) => {
  return selectedItem !== undefined ? selectedItem.id === item.id : false
}

function Select(props: SelectProps) {
  const {
    label = '',
    placeholder = 'Select an option',
    options,
    selectedOption,
    onSelect,
    onRemove,
    onCleanClick,
    className,
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
      if (selectedItem) {
        handleChange(selectedItem)
        selectItem(null)
      }
    },
  })

  const handleChange = useCallback(
    (option: SelectOption) => {
      if (isItemSelected(selectedOption, option)) {
        onRemove(option)
      } else {
        onSelect(option)
      }
    },
    [onRemove, onSelect, selectedOption]
  )
  const hasSelectedOptions = selectedOption !== undefined
  return (
    <div>
      <label {...getLabelProps()}>{label}</label>
      <div
        className={cx(
          styles.container,
          { [styles.isOpen]: isOpen },
          { [styles.placeholderShown]: !selectedOption },
          className
        )}
      >
        <div {...getToggleButtonProps()} className={styles.placeholderContainer}>
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
        <ul {...getMenuProps()} className={styles.optionsContainer}>
          {isOpen &&
            options.length > 0 &&
            options.map((item, index) => {
              const highlight = highlightedIndex === index
              const selected = isItemSelected(selectedOption, item)
              return (
                <Tooltip key={`${item}${index}`} content={item.tooltip} placement="top-start">
                  <li
                    className={cx(styles.optionItem, {
                      [styles.selected]: selected,
                      [styles.highlight]: highlight,
                    })}
                    {...getItemProps({ item, index })}
                  >
                    {item.label}
                    {highlight && <Icon icon={selected ? 'close' : 'tick'} />}
                  </li>
                </Tooltip>
              )
            })}
        </ul>
      </div>
    </div>
  )
}

export default memo(Select)
