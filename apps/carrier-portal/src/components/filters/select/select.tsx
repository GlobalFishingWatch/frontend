import React, { useState, useMemo, useCallback, createRef } from 'react'
import cx from 'classnames'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'
import { matchSorter } from 'match-sorter'
import orderBy from 'lodash/orderBy'
import Tooltip from 'components/tooltip/tooltip'
import useAbortableFetch from 'hooks/fetch.hooks'
import { ReactComponent as IconSearch } from 'assets/icons/search.svg'
import { ReactComponent as IconDelete } from 'assets/icons/delete.svg'
import { ReactComponent as IconArrowDown } from 'assets/icons/arrow-down.svg'
import { ReactComponent as IconRecent } from 'assets/icons/recent.svg'
import { SearchItem } from 'types/app.types'
import IconButton from 'components/icon-button/icon-button'
import { PaginatedVesselSearch } from 'types/api/models'
import { SELECT_GROUPS, SelectGroup } from 'data/constants'
import { parseVesselSearchResponse } from 'utils'
import styles from './select.module.css'

type SelectIcons = 'recent'
const icons: { [key in SelectIcons]: React.ReactElement } = {
  recent: <IconRecent />,
}

export interface SelectOptions extends SearchItem {
  selected?: boolean
  group?: SelectGroup
  description?: string
  icon?: SelectIcons
  legend?: string
  values?: SearchItem[]
  counter?: number
  isFirstOfGroup?: boolean
}

interface SelectProps {
  options: SelectOptions[] | null
  asyncUrl?: string // url to fetch with {{query}} param to replace
  selectedFirst?: boolean
  selectedItems: SearchItem[] | null
  onSelectedItem(item: SearchItem): void
  onRemoveItem(item: SearchItem): void
  onCleanClick?(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
  label: string
  typeLabel: string
  tooltip?: string
}

const isSelected = (selectedItems: SearchItem[], item: SearchItem) => {
  return selectedItems !== null ? selectedItems.some((selected) => selected.id === item.id) : false
}

const Select: React.FC<SelectProps> = (props): React.ReactElement => {
  const {
    options = [],
    selectedItems,
    selectedFirst = true,
    label,
    tooltip,
    asyncUrl,
    onCleanClick,
  } = props
  const isAsync = asyncUrl !== undefined

  const input = createRef<any>()
  const [inputValue, setInputvalue] = useState<string | null>(null)

  const searchUrl = useMemo(() => {
    return asyncUrl && inputValue !== null ? asyncUrl.replace('{{query}}', inputValue) : ''
  }, [asyncUrl, inputValue])

  const { data, loading } = useAbortableFetch<PaginatedVesselSearch>(searchUrl)
  const asyncOptions = useMemo(() => parseVesselSearchResponse(data), [data])

  const itemToString = (item: SearchItem | null) => (item ? item.label : '')

  const getOptionsFiltered = useCallback(
    (
      options: SelectOptions[],
      asyncOptions: SelectOptions[],
      filter: string | null
    ): SelectOptions[] => {
      let optionsFiltered = filter
        ? matchSorter(options, filter, {
            keys: ['label'],
          })
        : [...options]

      // Because we don't want to have asyncOptions filtered by matchSorted, already done in API
      optionsFiltered = optionsFiltered.concat([...asyncOptions])

      if (selectedFirst && selectedItems !== null && selectedItems.length) {
        const optionsFilteredSelected = optionsFiltered
          .map((option) => {
            const selected = isSelected(selectedItems, option)
            return {
              ...option,
              selected,
              ...(!option.group && selected && { group: SELECT_GROUPS.selected }),
            }
          })
          .filter((item) => {
            return (
              !item.selected ||
              (item.selected && item.group && item.group.id === SELECT_GROUPS.selected.id)
            )
          })

        optionsFiltered = orderBy(
          optionsFilteredSelected,
          ['selected', 'group.order', 'label'],
          ['desc', 'asc', 'asc']
        )
      }

      const multipleGroups = optionsFiltered.some((o) => o.group !== undefined)
      const optionsFilteredWithGroups = optionsFiltered.map((option, index) => {
        const previousElementGroup = optionsFiltered[index - 1] && optionsFiltered[index - 1].group
        const isDifferentThanPrevious = option.group
          ? previousElementGroup && option.group.id !== previousElementGroup.id
          : previousElementGroup !== option.group
        const isFirstOfGroup = multipleGroups && (index === 0 || isDifferentThanPrevious)
        return { ...option, isFirstOfGroup }
      })

      return optionsFilteredWithGroups
    },
    [selectedFirst, selectedItems]
  )

  const stateReducer = (
    state: DownshiftState<SearchItem[]>,
    changes: StateChangeOptions<SearchItem[]>
  ): StateChangeOptions<SearchItem[]> => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem: {
        if (isAsync && input.current !== null) input.current.blur()
        return {
          ...changes,
          isOpen: !isAsync,
          highlightedIndex: state.highlightedIndex,
          inputValue: '',
        }
      }
      case Downshift.stateChangeTypes.changeInput: {
        return changes
      }
      case Downshift.stateChangeTypes.keyDownEscape:
        if (input.current !== null) input.current.blur()
        return { ...changes, inputValue: state.inputValue }
      default:
        return { ...changes, inputValue: state.inputValue }
    }
  }

  const onStateChange = (
    changes: StateChangeOptions<SearchItem>,
    state: DownshiftState<SearchItem>
  ) => {
    const inputValue = state.inputValue || null
    setInputvalue(inputValue)
  }

  const handleChange = (item: SearchItem | null) => {
    if (item) {
      if (props.selectedItems !== null && isSelected(props.selectedItems, item)) {
        props.onRemoveItem(item)
      } else {
        props.onSelectedItem(item)
      }
    }
  }

  const getPlaceHolderBySelection = (isOpen: boolean) => {
    const { selectedItems, typeLabel } = props

    let placeholder = ''
    const hasSelectedItems = selectedItems !== null
    if (!hasSelectedItems || (selectedItems !== null && selectedItems.length === 0 && !isOpen))
      placeholder = `All ${typeLabel}s`
    else if (selectedItems !== null) {
      if (isOpen) placeholder = `Type to search`
      else if (selectedItems.length === 1) placeholder = selectedItems[0].label
      else placeholder = `${selectedItems.length} ${typeLabel}s selected`
    }

    return placeholder
  }

  const allOptions = useMemo(() => {
    const optionsFiltered = getOptionsFiltered(options || [], asyncOptions, inputValue)
    if (inputValue !== '' && isAsync && !loading && optionsFiltered.length === 0) {
      optionsFiltered.push({
        id: 'no-results',
        label: 'There were no results for the given search',
      })
    }
    return optionsFiltered
  }, [getOptionsFiltered, options, asyncOptions, inputValue, isAsync, loading])

  return (
    <div className={styles.downshiftContainer}>
      <Tooltip content={tooltip}>
        <label>{label}</label>
      </Tooltip>
      <Downshift<any>
        selectedItem={null}
        stateReducer={stateReducer}
        onStateChange={onStateChange}
        onChange={handleChange}
        itemToString={itemToString}
      >
        {(downshift: any) => {
          const {
            getInputProps,
            getToggleButtonProps,
            getMenuProps,
            isOpen,
            getItemProps,
            highlightedIndex,
            openMenu,
            closeMenu,
          } = downshift
          return (
            <div className={cx(styles.container, { [styles.isOpen]: isOpen })}>
              <div className={styles.selectedItem}>
                <input
                  placeholder={getPlaceHolderBySelection(isOpen)}
                  {...getInputProps({ ref: input })}
                  className={cx(styles.inputText, {
                    [styles.active]: isOpen || (selectedItems && selectedItems.length > 0),
                  })}
                  onClick={openMenu}
                  type="search"
                  autoComplete="disabled"
                />
                {loading && <span className={styles.spinner} />}
                {onCleanClick !== undefined && selectedItems && selectedItems.length > 0 && (
                  <IconButton
                    size="small"
                    aria-label="Remove filter"
                    className={styles.toggleBtn}
                    onClick={onCleanClick}
                  >
                    <IconDelete />
                  </IconButton>
                )}
                <IconButton
                  {...getToggleButtonProps()}
                  className={cx(styles.toggleBtn, {
                    [styles.toggleBtnSearchIcon]: isAsync,
                    [styles.toggleBtnOpen]: !isAsync && isOpen,
                  })}
                  onClick={() => {
                    if (isOpen) {
                      closeMenu()
                    } else {
                      openMenu()
                      if (input.current !== null) input.current.focus()
                    }
                  }}
                  size="small"
                >
                  {isAsync ? <IconSearch /> : <IconArrowDown />}
                </IconButton>
              </div>
              <ul {...getMenuProps()} className={styles.listContainer}>
                {isOpen &&
                  allOptions &&
                  allOptions.map((item, index) => {
                    return (
                      <li
                        {...getItemProps({ item, index })}
                        className={cx(styles.listItem, {
                          [styles.highlighted]: highlightedIndex === index,
                          [styles.selected]: item.selected,
                          [styles.firstOfGroup]: item.isFirstOfGroup,
                        })}
                        key={item.id + (item.icon || '')}
                        data-group={item.group ? item.group.label : label}
                      >
                        <Tooltip content={item.description}>
                          <p className={styles.listItemLabel}>
                            {item.icon && icons[item.icon as SelectIcons]}
                            <span>{item.label}</span>
                            {item.counter !== undefined && (
                              <span className={styles.listItemNumber}>({item.counter})</span>
                            )}
                          </p>
                        </Tooltip>
                      </li>
                    )
                  })}
              </ul>
            </div>
          )
        }}
      </Downshift>
    </div>
  )
}

export default Select
