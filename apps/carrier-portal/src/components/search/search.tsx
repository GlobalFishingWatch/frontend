import React, { useCallback, useMemo } from 'react'
import cx from 'classnames'
import Downshift, { DownshiftState, StateChangeOptions, ControllerStateAndHelpers } from 'downshift'
import { FixedSizeList } from 'react-window'
import { CountryFlag } from '@globalfishingwatch/ui-components'
import { useSmallScreen } from 'hooks/screen.hooks'
import { SEARCH_TYPES } from 'data/constants'
import { SearchItemType } from 'types/app.types'
import { getInputFields, replaceWithBreakingSpaces, removeSpecialCharacters } from './search.utils'
import styles from './search.module.css'

const getPlaceholderByType = (type: string, counter: number | undefined): string => {
  const prefix = 'Press ⏎ to'
  const sufix = counter ? `(${counter})` : ''
  let string = 'select'
  switch (type) {
    case SEARCH_TYPES.flag:
      string = 'see the activity of carriers under this flag'
      break
    case SEARCH_TYPES.flagDonor:
      string = 'see the activity of donor vessels under this flag'
      break
    case SEARCH_TYPES.rfmo:
      string = "see the activity that occurred in this RFMO's area"
      break
    case SEARCH_TYPES.port:
      string = 'see the activity that occurred before visiting this port'
      break
    case SEARCH_TYPES.start:
      string = 'see the activity that occurred in this date and after'
      break
    case SEARCH_TYPES.end:
      string = 'see the activity that occurred in this date and before'
      break
    case SEARCH_TYPES.vessel:
      string = 'see the activity from this vessel'
      break
  }
  return `${prefix} ${string} ${sufix}`
}

const getInputWithErrors = (input: string, selection: SearchItemType[] | null) => {
  if (!input) return ''
  const selectionStrings =
    selection !== null
      ? Array.from(
          new Set([
            ...selection.map((s) => replaceWithBreakingSpaces(s.label)),
            ...selection.map((s) => s.type),
          ])
        )
      : []
  const inputStrings = getInputFields(input)
  const incorrectInputStrings = inputStrings.filter(
    (i) => !selectionStrings.some((label) => label === i)
  )
  let inputWithErrors = removeSpecialCharacters(input)
  if (incorrectInputStrings.length) {
    incorrectInputStrings.forEach((incorrectInput) => {
      inputWithErrors = inputWithErrors.replace(
        new RegExp(`\\b${removeSpecialCharacters(incorrectInput)}\\b`, 'g'),
        `<span class=${styles.searchItemError}>${incorrectInput}</span>`
      )
    })
  }
  return <span dangerouslySetInnerHTML={{ __html: inputWithErrors }} /> // eslint-disable-line
}

interface SearchProps {
  items: SearchItemType[]
  loading?: boolean
  setDownshiftRef(downshift: ControllerStateAndHelpers<SearchItemType[]>): void
  downshiftRefLoaded: boolean
  initialInputValue?: string
  initialSelection?: SearchItemType[] | null
  itemToString(item: SearchItemType | null): string
  customEventHandler?(
    event: React.SyntheticEvent,
    downshiftState: DownshiftState<SearchItemType[]>
  ): void
  stateReducer(
    state: DownshiftState<SearchItemType[] | null>,
    changes: StateChangeOptions<SearchItemType[] | null>
  ): StateChangeOptions<SearchItemType[]>
  onStateChange(
    changes: StateChangeOptions<SearchItemType[] | null>,
    downshiftState: DownshiftState<SearchItemType[] | null>
  ): void
  onOuterClick: (
    state: DownshiftState<SearchItemType[] | null> | { selectedItem: SearchItemType[] }
  ) => void
  onFocus?: () => void
}

const Search: React.FC<SearchProps> = (props) => {
  const {
    itemToString,
    setDownshiftRef,
    downshiftRefLoaded,
    initialInputValue,
    onOuterClick,
    initialSelection,
    customEventHandler,
    stateReducer,
    items,
    onStateChange,
    onFocus,
    loading,
  } = props

  const smallScreen = useSmallScreen()

  const itemsWithLoading = useMemo(
    () => (loading ? [...items, { type: 'loading', id: 'loading', label: 'loading' }] : items),
    [items, loading]
  )

  const getItemKey = useCallback(
    (index: number) => {
      return itemsWithLoading[index].key || itemsWithLoading[index].id
    },
    [itemsWithLoading]
  )

  return (
    <Downshift<any>
      initialInputValue={initialInputValue}
      initialSelectedItem={initialSelection}
      onOuterClick={onOuterClick}
      stateReducer={stateReducer}
      itemToString={itemToString}
      onStateChange={onStateChange}
      defaultHighlightedIndex={0}
    >
      {(downshift) => {
        if (downshiftRefLoaded === false) {
          setDownshiftRef(downshift)
        }
        const {
          getInputProps,
          getLabelProps,
          getMenuProps,
          getItemProps,
          isOpen,
          setState,
          inputValue,
          selectedItem,
          highlightedIndex,
        } = downshift

        return (
          <div className={styles.searchContainer}>
            <div>
              {!isOpen && (
                <div className={styles.searchErrorsContainer}>
                  {getInputWithErrors(inputValue || '', selectedItem)}
                </div>
              )}
              <label className="sr-only" {...getLabelProps()}>
                Autocomplete filters search
              </label>
              <input
                id="search-input"
                data-cy="search-input"
                className={styles.searchInput}
                {...getInputProps({
                  placeholder: 'Search a vessel or add filters like "flag:china" or "rfmo:IATTC"',
                  ...(onFocus && { onFocus }),
                  onKeyDown:
                    customEventHandler !== undefined
                      ? (event) => customEventHandler(event, downshift)
                      : undefined,
                  onClick:
                    customEventHandler !== undefined
                      ? (event) => customEventHandler(event, downshift)
                      : undefined,
                })}
                type="search"
                spellCheck={false}
              />
            </div>
            {!isOpen ? null : (
              <div
                onClick={() => {
                  onOuterClick({ selectedItem: selectedItem })
                  setState({ isOpen: false })
                }}
                data-cy="search-results"
                className={styles.optionListContainer}
              >
                {itemsWithLoading && itemsWithLoading.length > 0 ? (
                  <FixedSizeList
                    height={540}
                    itemSize={50}
                    itemCount={itemsWithLoading.length}
                    outerElementType="ul"
                    itemKey={getItemKey}
                    className={styles.optionList}
                    overscanCount={5}
                    {...getMenuProps()}
                  >
                    {({ index, style }) => {
                      const item = itemsWithLoading[index]
                      if (item.type === 'loading') {
                        return (
                          <li
                            key={item.id}
                            className={styles.optionlistItemLoading}
                            style={{ ...(style as React.CSSProperties) }}
                          >
                            <span className={styles.spinner} />
                          </li>
                        )
                      }
                      return (
                        <li
                          key={item.key || `${item.type}-${item.id}`}
                          className={cx(styles.optionlistItem, {
                            [styles.highlighted]: highlightedIndex === index,
                          })}
                          {...getItemProps({ item, index })}
                          style={{ ...style }}
                        >
                          <div className={styles.optionListText}>
                            {item.type}:{' '}
                            {item.type === SEARCH_TYPES.flag && <CountryFlag iso={item.id} />}{' '}
                            {item.type === SEARCH_TYPES.vessel && item.iso && (
                              <CountryFlag iso={item.iso} />
                            )}{' '}
                            {itemToString(item)}
                            {item.legend && (
                              <span className={styles.optionListLegend}> ({item.legend})</span>
                            )}
                          </div>
                          <span className={styles.optionlistItemPlaceholder}>
                            {highlightedIndex === index && !smallScreen
                              ? getPlaceholderByType(item.type, item.counter)
                              : item.counter}
                          </span>
                        </li>
                      )
                    }}
                  </FixedSizeList>
                ) : (
                  <span className={styles.optionlistItem}>
                    There are no filters matching your query
                  </span>
                )}
              </div>
            )}
          </div>
        )
      }}
    </Downshift>
  )
}

export default Search
