import React, { useCallback, useState, useMemo, Fragment } from 'react'
import { matchSorter } from 'match-sorter'
import {
  useMultipleSelection,
  useCombobox,
  UseComboboxState,
  UseComboboxStateChangeTypes,
} from 'downshift'
import cx from 'classnames'
import { Icon, IconType } from '../icon'
import { IconButton } from '../icon-button'
import { Tooltip } from '../tooltip'
import { InputText } from '../input-text'
import styles from '../select/Select.module.css'
import multiSelectStyles from './MultiSelect.module.css'

export type SelectOptionId = number | string
export type MultiSelectOption<T = any> = {
  id: T
  label: string | JSX.Element
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
  label?: string
  placeholder?: string
  placeholderDisplayAll?: boolean
  options: MultiSelectOption[]
  selectedOptions?: MultiSelectOption[]
  disabled?: boolean
  disabledMsg?: string
  onFilterOptions?: MultiSelectOnFilter
  onSelect: MultiSelectOnChange
  onRemove?: MultiSelectOnChange
  onCleanClick?: (e: React.MouseEvent) => void
  className?: string
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
    : selections[0]?.label
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
    label = '',
    options,
    selectedOptions = [],
    placeholderDisplayAll = false,
    placeholder,
    className = '',
    onSelect,
    onRemove,
    onCleanClick,
    disabled = false,
    disabledMsg = '',
    onFilterOptions,
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

  const [inputValue, setInputValue] = useState('')
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
    openMenu,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    selectItem,
    getItemProps,
  } = useCombobox<MultiSelectOption | null>({
    items: filteredItems,
    inputValue,
    stateReducer: (state, { changes, type }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick: {
          return {
            ...changes,
            isOpen: true, // keep menu open after selection.
            inputValue: '', // don't add the item string as input value at selection.
            highlightedIndex: state.highlightedIndex,
          }
        }
        case useCombobox.stateChangeTypes.InputBlur: {
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
  })

  const hasSelectedOptions = selectedOptions && selectedOptions.length > 0

  return (
    <div className={className}>
      <div className={styles.labelContainer}>
        {label !== undefined && (
          <label {...getLabelProps()} className={cx(styles.label, { [styles.disabled]: disabled })}>
            {label}
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
          {...getComboboxProps()}
        >
          <InputText
            {...getInputProps({
              ...getDropdownProps({
                onFocus: () => {
                  if (!isOpen) {
                    openMenu()
                  }
                },
                preventKeyAction: isOpen,
              }),
            })}
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
                aria-label={'toggle menu'}
                {...getToggleButtonProps(getDropdownProps({ preventKeyAction: isOpen }))}
              ></IconButton>
            </Fragment>
          )}
        </div>
        <ul {...getMenuProps()} className={styles.optionsContainer}>
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
                    className={cx(styles.optionItem, {
                      [styles.highlight]: highlight,
                      [item.className || '']: item.className,
                    })}
                    {...getItemProps({ item, index })}
                  >
                    {item.label}
                    {icon && <Icon icon={icon} />}
                  </li>
                </Tooltip>
              )
            })}
        </ul>
      </div>
    </div>
  )
}
