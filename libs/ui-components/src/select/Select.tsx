import type { MouseEvent } from 'react'
import React, { useCallback, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import cx from 'classnames'
import { useSelect } from 'downshift'

import { Icon } from '../icon'
import { IconButton } from '../icon-button'
import { Tooltip } from '../tooltip'

import type { SelectOnChange, SelectOption } from './index'

import styles from './Select.module.css'

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
  infoTooltip?: string
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
    infoTooltip,
  } = props

  const listRef = useRef<HTMLUListElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 40,
    overscan: 5,
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

  const { isOpen, selectItem, highlightedIndex, getToggleButtonProps, getMenuProps, getItemProps } =
    useSelect<SelectOption | null>({
      ...((id && { id }) || {}),
      items: options,
      onSelectedItemChange: ({ selectedItem }) => {
        if (!disabled && selectedItem && !selectedItem.disabled) {
          handleChange(selectedItem)
          selectItem(null)
        }
      },
    })

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
        <label className={cx(styles.label, labelContainerClassName)}>
          {label}
          {error && <span className={styles.errorLabel}>{error}</span>}
          {infoTooltip && (
            <Tooltip content={infoTooltip}>
              <IconButton icon="info" size="tiny" className={styles.infoIcon} />
            </Tooltip>
          )}
        </label>
      )}
      <div
        className={cx(
          styles.container,
          styles[type],
          { [styles.isOpen]: !disabled && isOpen },
          { [styles.placeholderShown]: !selectedOption },
          { [styles.error]: error !== '' },
          { [styles.disabled]: disabled },
          className
        )}
      >
        <div
          {...toggleButtonProps}
          role="button"
          tabIndex={0}
          className={styles.placeholderContainer}
          onClick={onToggleButtonClick ? handleToggleButtonClick : toggleButtonProps.onClick}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </div>
        <div className={styles.buttonsContainer}>
          {onCleanClick !== undefined && hasSelectedOptions && !disabled && (
            <IconButton icon="delete" size="small" onClick={onCleanClick} />
          )}
          {!disabled && (
            <IconButton
              icon={isOpen ? 'arrow-top' : 'arrow-down'}
              size="small"
              {...getToggleButtonProps()}
            />
          )}
        </div>
        <ul
          ref={listRef}
          {...getMenuProps()}
          className={cx(styles.optionsContainer, styles[direction], styles[align])}
        >
          {!disabled && isOpen && options.length > 0 && (
            <div
              ref={scrollRef}
              style={{
                maxHeight: '24rem',
                overflow: 'auto',
                width: '100%',
              }}
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const item = options[virtualRow.index]
                  const highlight = highlightedIndex === virtualRow.index
                  const selected = isItemSelected(selectedOption, item)
                  const itemDisabled = disabled || item.disabled
                  return (
                    <Tooltip key={virtualRow.key} content={item.tooltip} placement="top-start">
                      <li
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        className={cx(styles.optionItem, {
                          [styles.selected]: selected,
                          [styles.highlight]: highlight,
                          [styles.notAllowed]: itemDisabled,
                        })}
                        {...getItemProps({ item, index: virtualRow.index })}
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
              </div>
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}
