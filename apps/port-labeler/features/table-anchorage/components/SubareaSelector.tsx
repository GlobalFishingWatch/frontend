import React, { useCallback } from 'react'
import cx from 'classnames'
import { useSelect } from 'downshift'
import { Button, IconButton, InputText, SelectOnChange, SelectOption, Tooltip } from '@globalfishingwatch/ui-components'
import styles from './SubareaSelector.module.css'

export interface SubareaSelectOption<T = any> extends SelectOption {
  color?: string
}

interface SelectProps {
  label?: string
  addButtonLabel?: string
  placeholder?: string
  options: SubareaSelectOption[]
  selectedOption?: SubareaSelectOption
  onSelect: SelectOnChange
  onRemove: SelectOnChange
  onAddNew: () => void
  onSelectedNameChange: (id, label) => void
  onCleanClick?: (e: React.MouseEvent) => void
  containerClassName?: string
  className?: string
  direction?: 'bottom' | 'top'
  disabled?: boolean
  children?: React.ReactNode
}

const isItemSelected = (selectedItem: SelectOption | undefined, item: SelectOption) => {
  return selectedItem !== undefined ? selectedItem.id === item.id : false
}

export function SubareaSelector(props: SelectProps) {
  const {
    label = '',
    addButtonLabel = 'CREATE NEW',
    placeholder = '---?',
    options,
    selectedOption,
    onSelect,
    onRemove,
    onAddNew,
    onCleanClick,
    onSelectedNameChange,
    containerClassName = '',
    className = '',
    direction = 'bottom',
    disabled = false,
  } = props
  const {
    isOpen,
    selectItem,
    highlightedIndex,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
  } = useSelect<SubareaSelectOption | null>({
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
    <div className={containerClassName}>
      <label {...getLabelProps()}>{label}</label>
      <div
        className={cx(
          styles.container,
          { [styles.isOpen]: isOpen },
          { [styles.placeholderShown]: !selectedOption },
          className
        )}
      >
        <div className={styles.placeholderContainer}>
          <InputText value={selectedOption?.label ?? placeholder}
            className={styles.noBorder} onChange={(e) => {
              if (selectedOption) {
                onSelectedNameChange(selectedOption.id, e.target.value)
              }
            }} />
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
              return (
                <Tooltip key={`${item}${index}`} content={item.tooltip} placement="top-start">
                  <li
                    className={cx(styles.optionItem)}
                    {...getItemProps({ item, index })}
                  >
                    {item.label}
                    {item.color && <div className={styles.dot} style={{ background: `${item.color}` }}></div>}
                  </li>
                </Tooltip>
              )
            })}
          {isOpen && <li className={cx(
            styles.optionItem, styles.actionItem, className)}>
            <Button size="small" className={styles.addButton} type="secondary" onClick={onAddNew}>{addButtonLabel}</Button>
          </li>}
        </ul>
        {selectedOption && selectedOption.color && <div className={styles.selectedDot}
          style={{
            background: `${selectedOption.color}`,
          }}
        ></div>
        }
      </div>
    </div>
  )
}

export default SubareaSelector
