import React, { Fragment, type JSX,useCallback, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import type {
  UseComboboxState,
  UseComboboxStateChange,
  UseComboboxStateChangeTypes,
} from 'downshift'
import { useCombobox,useMultipleSelection } from 'downshift'
import { matchSorter } from 'match-sorter'

import type { IconType } from '../icon'
import { Icon } from '../icon'
import { IconButton } from '../icon-button'
import { InputText } from '../input-text'
import { Tooltip } from '../tooltip'

import styles from '../select/Select.module.css'
import multiSelectStyles from './MultiSelect.module.css'

export type SelectOptionId = number | string
export type MultiSelectOption<ID = any, Label = string | JSX.Element> = {
  id: ID
  label: Label
  alias?: string[]
  tooltip?: string
  disableSelection?: boolean
  className?: string
}
/**
 * Callback on selecting or removing options
 * @param {SelectOption} option - Selected option
 * @param {SelectOption[]} [selectedOptions] - The list of new options after changes
 */
export type MultiSelectOnChange = (
  option: MultiSelectOption,
  selectedOptions: MultiSelectOption[]
) => void
/**
 * Callback on filtering options
 * @param {MultiSelectOption[]} options - The list of options available
 * @param {MultiSelectOption[]} filteredOptions - The options filtered by applying the filter
 * @param {string} [filter] - The text entered by the user to filter on
 * @returns Options to be displayed in the MultiSelect
 */
export type MultiSelectOnFilter = (
  allOptions: MultiSelectOption[],
  filteredOptions: MultiSelectOption[],
  filter?: string
) => MultiSelectOption[]
/**
 * Callback on removing all options
 */
export type MultiSelectOnRemove = (event: React.MouseEvent) => void

interface MultiSelectProps {
  id?: string
  label?: string
  placeholder?: string
  placeholderDisplayAll?: boolean
  options: MultiSelectOption[]
  selectedOptions?: MultiSelectOption[]
  disabled?: boolean
  disabledMsg?: string
  direction?: 'bottom' | 'top'
  onFilterOptions?: MultiSelectOnFilter
  onIsOpenChange?: (open: boolean) => void
  onSelect: MultiSelectOnChange
  onRemove?: MultiSelectOnChange
  onCleanClick?: (e: React.MouseEvent) => void
  className?: string
  labelContainerClassName?: string
  testId?: string
  infoTooltip?: string
}

const getPlaceholderBySelections = (
  selections: MultiSelectOption[],
  displayAll: boolean
): string => {
  if (!selections?.length) return 'Select an option'
  return displayAll
    ? selections
        .map((elem: MultiSelectOption) => {
          return elem.label
        })
        .join(', ')
    : selections.length > 1
    ? `${selections.length} selected`
    : selections[0]?.label.toString()
}

const isItemSelected = (selectedItems: MultiSelectOption[], item: MultiSelectOption) => {
  return selectedItems !== null ? selectedItems.some((selected) => selected.id === item.id) : false
}

const getItemsFiltered = (items: MultiSelectOption[], filter?: string) => {
  if (!filter) return items
  const matchingItems = matchSorter(items, filter, {
    keys: ['id', 'label', 'alias'],
  })
  return matchingItems
}

export function MultiSelect(props: MultiSelectProps) {
  const {
    id,
    label = '',
    options,
    selectedOptions = [],
    placeholderDisplayAll = false,
    placeholder,
    className = '',
    labelContainerClassName = '',
    direction = 'bottom',
    onSelect,
    onRemove,
    onCleanClick,
    onIsOpenChange,
    disabled = false,
    disabledMsg = '',
    onFilterOptions,
    testId = 'multi-select',
    infoTooltip,
  } = props

  const handleRemove = useCallback(
    (option: MultiSelectOption) => {
      if (onRemove && !disabled) {
        const newOptions = selectedOptions.filter(
          (selectedOption) => selectedOption.id !== option.id
        )
        onRemove(option, newOptions)
      }
    },
    [disabled, onRemove, selectedOptions]
  )

  const handleSelect = useCallback(
    (option: MultiSelectOption) => {
      const newOptions = [...selectedOptions, option]
      onSelect(option, newOptions)
    },
    [onSelect, selectedOptions]
  )

  const handleChange = useCallback(
    (option: MultiSelectOption) => {
      if (selectedOptions !== null && isItemSelected(selectedOptions, option)) {
        handleRemove(option)
      } else {
        handleSelect(option)
      }
    },
    [handleRemove, handleSelect, selectedOptions]
  )

  const handleIsOpenChange = useCallback(
    (changes: UseComboboxStateChange<MultiSelectOption | null>) => {
      if (onIsOpenChange) {
        onIsOpenChange(changes.isOpen as boolean)
      }
    },
    [onIsOpenChange]
  )

  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const handleFilter = useMemo(
    () =>
      // apply onFilter callback when provided otherwise just use
      // items filtered with default callback getItemsFiltered
      onFilterOptions ?? ((_: MultiSelectOption[], filtered: MultiSelectOption[]) => filtered),
    [onFilterOptions]
  )
  const filteredItems = useMemo(
    () => handleFilter(options, getItemsFiltered(options, inputValue), inputValue),
    [handleFilter, options, inputValue]
  )

  const { getDropdownProps } = useMultipleSelection({ selectedItems: selectedOptions })
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    selectItem,
    getItemProps,
  } = useCombobox<MultiSelectOption | null>({
    ...((id && { id }) || {}),
    items: filteredItems,
    inputValue,
    stateReducer: (state, { changes, type }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick: {
          return {
            ...changes,
            isOpen: changes.selectedItem ? state.isOpen : true,
            inputValue: '', // don't add the item string as input value at selection.
            highlightedIndex: state.highlightedIndex,
          }
        }
        case useCombobox.stateChangeTypes.InputKeyDownEscape:
        case useCombobox.stateChangeTypes.InputBlur: {
          setInputValue('')
          inputRef.current?.blur()
          return {
            ...changes,
            inputValue: '',
          }
        }
        default:
          return changes
      }
    },
    onStateChange: ({
      type,
      selectedItem,
    }: Partial<UseComboboxState<MultiSelectOption | null>> & {
      type?: UseComboboxStateChangeTypes
    }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick: {
          if (selectedItem) {
            handleChange(selectedItem)
            setInputValue('')
            selectItem(null)
          }
          break
        }
        case useCombobox.stateChangeTypes.InputBlur: {
          setInputValue('')
          break
        }
        default:
          break
      }
    },
    onIsOpenChange: handleIsOpenChange,
  })

  const hasSelectedOptions = selectedOptions && selectedOptions.length > 0

  return (
    <div className={className}>
      <div className={cx(styles.labelContainer, labelContainerClassName)}>
        {label !== undefined && (
          <label className={cx(styles.label, { [styles.disabled]: disabled })}>
            {label}
            {infoTooltip && (
              <Tooltip content={infoTooltip}>
                <IconButton icon="info" size="tiny" className={styles.infoIcon} />
              </Tooltip>
            )}
          </label>
        )}
        {disabled && disabledMsg && (
          <IconButton
            size="small"
            type="warning"
            icon="warning"
            tooltip={disabledMsg}
            className={multiSelectStyles.iconWarning}
          />
        )}
      </div>
      <div
        className={cx(styles.container, { [styles.isOpen]: isOpen, [styles.notAllowed]: disabled })}
      >
        <div
          className={cx(styles.placeholderContainer, multiSelectStyles.placeholderContainer, {
            [styles.disabled]: disabled,
          })}
        >
          <InputText
            {...getInputProps({
              ref: inputRef,
            })}
            data-test={`${testId}-input`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              placeholder || getPlaceholderBySelections(selectedOptions, placeholderDisplayAll)
            }
            className={multiSelectStyles.input}
          />
        </div>
        <div className={styles.buttonsContainer}>
          {!disabled && (
            <Fragment>
              {onCleanClick !== undefined && hasSelectedOptions && (
                <IconButton icon="delete" size="small" onClick={onCleanClick}></IconButton>
              )}
              <IconButton
                icon={isOpen ? 'arrow-top' : 'arrow-down'}
                size="small"
                data-test={`${testId}-toggle`}
                aria-label={'toggle menu'}
                {...getToggleButtonProps(getDropdownProps({ preventKeyAction: isOpen }))}
              ></IconButton>
            </Fragment>
          )}
        </div>
        <ul {...getMenuProps()} className={cx(styles.optionsContainer, styles[direction])}>
          {isOpen &&
            filteredItems.length > 0 &&
            filteredItems.map((item, index) => {
              const highlight = highlightedIndex === index
              const isSelected =
                hasSelectedOptions &&
                selectedOptions.some(({ id }) => item.id === id) &&
                !item.disableSelection
              const icon =
                highlight && isSelected
                  ? 'close'
                  : (highlight || isSelected) && !item.disableSelection
                  ? 'tick'
                  : ('' as IconType)
              return (
                <Tooltip key={item.id} content={item.tooltip} placement="top-start">
                  <li
                    data-test={`${testId}-option-${item.id}`}
                    className={cx(styles.optionItem, {
                      [styles.highlight]: highlight,
                      [item.className || '']: item.className,
                    })}
                    {...getItemProps({ item, index })}
                  >
                    {item.label}
                    {
                      <Icon
                        icon={icon || 'tick'}
                        className={cx(styles.icon, {
                          [styles.visible]: icon,
                        })}
                      />
                    }
                  </li>
                </Tooltip>
              )
            })}
        </ul>
      </div>
    </div>
  )
}
