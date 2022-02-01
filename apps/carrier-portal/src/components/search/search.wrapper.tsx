import React, { useCallback, useMemo, useRef, useEffect } from 'react'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'
import debounce from 'lodash/debounce'
import uniqBy from 'lodash/uniqBy'
import isEqual from 'lodash/isEqual'
import { SEARCH_SINGLE_SELECTION_FIELD, SEARCH_TYPES_MUTUALLY_EXCLUSIVE } from 'data/constants'
import { SearchItemType, SearchItem } from 'types/app.types'
import { parseSelectionToInput, calculateCursorPosition, parseInputToFields } from './search.utils'
import { useResultsFiltered } from './search.hooks'
import SearchComponent from './search'

interface SearchContainerProps {
  searchUrl: string
  selectedItems: SearchItemType[] | null
  staticOptions: SearchItemType[]
  onChange(selectedItems: SearchItemType[]): void
  onFocus?(): void
  onBlur?(): void
}

const SearchContainer: React.FC<SearchContainerProps> = (props) => {
  const { searchUrl, selectedItems, onChange, staticOptions, onFocus, onBlur } = props
  const [state, dispatch] = useResultsFiltered(staticOptions, '', searchUrl)
  const { results, loading, cachedResults } = state
  const downshiftRef = useRef<any | null>(null)
  const setDownshiftRef = useCallback((downshift: any): void => {
    downshiftRef.current = downshift
  }, [])

  const debouncedDispatchChange = useMemo(
    () =>
      debounce((payload: any) => {
        dispatch({ type: 'inputChange', payload })
      }, 150),
    [dispatch]
  )

  const handleStateChange = useCallback(
    (
      changes: StateChangeOptions<SearchItemType[]>,
      downshiftState: DownshiftState<SearchItemType[]>
    ) => {
      if (changes.hasOwnProperty('inputValue')) {
        const { inputValue, selectedItem } = downshiftState
        const inputValueString = inputValue || ''
        debouncedDispatchChange({ search: inputValueString, selectedItem })
      }
    },
    [debouncedDispatchChange]
  )

  const handleConfirmSelection = useCallback(
    (
      state: DownshiftState<any>,
      changes: StateChangeOptions<any>,
      lastCharacter = ' '
    ): StateChangeOptions<any> => {
      const currentItems = state.selectedItem || []
      const isAlreadySelectedType = currentItems.some(
        (item: SearchItemType) => item.type === changes.selectedItem.type
      )
      const isSingleSelectionField = SEARCH_SINGLE_SELECTION_FIELD.includes(
        changes.selectedItem.type
      )
      let selectedItem = [...currentItems]

      const mutuallyExclusiveFields = SEARCH_TYPES_MUTUALLY_EXCLUSIVE[changes.selectedItem.type]
      if (mutuallyExclusiveFields && mutuallyExclusiveFields.length) {
        selectedItem = selectedItem.filter((item) => !mutuallyExclusiveFields.includes(item.type))
      }

      if ((isSingleSelectionField && !isAlreadySelectedType) || !isSingleSelectionField) {
        selectedItem.push(changes.selectedItem)
      } else {
        selectedItem = selectedItem.map((s) => {
          return s.type === changes.selectedItem.type ? changes.selectedItem : s
        })
      }

      // Adding a space at the end to start with a clean search when press enter
      const inputValue = parseSelectionToInput(selectedItem, lastCharacter)
      onChange(selectedItem)
      return { ...changes, selectedItem, inputValue }
    },
    [onChange]
  )

  const getSelectedItemsByInput = (
    input: string,
    currentSelection: SearchItemType[]
  ): SearchItemType[] => {
    if (!input) return []
    const inputValuesParsed = parseInputToFields(input)
    const selectedItems = currentSelection.flatMap((selectedItem: SearchItemType) => {
      const inputValue = inputValuesParsed.find((inputValue) => {
        return inputValue.type === selectedItem.type
      })
      return inputValue &&
        inputValue.labels !== undefined &&
        inputValue.labels.includes(selectedItem.label)
        ? selectedItem
        : []
    })
    return selectedItems
  }

  const handleExternalChanges = useCallback(
    (
      state: DownshiftState<SearchItemType[]>,
      changes: StateChangeOptions<SearchItemType[]>
    ): StateChangeOptions<SearchItemType[]> => {
      const typesIncluded: { [string: string]: boolean } = {}
      if (isEqual(state.selectedItem, changes.selectedItem)) {
        return changes
      }
      //custom function to work with flags and domFlags (same ID)
      const uniqueSelections = uniqBy(changes.selectedItem, (elem) => [elem.id, elem.type].join())
      const selectedItem = uniqueSelections.filter((item) => {
        if (!item) return false
        if (typesIncluded[item.type] !== undefined) {
          return !SEARCH_SINGLE_SELECTION_FIELD.includes(item.type)
        }
        typesIncluded[item.type] = true
        return true
      })
      const inputValue = parseSelectionToInput(selectedItem)
      return { ...changes, inputValue, selectedItem }
    },
    []
  )
  const handleChangeInput = useCallback(
    (
      state: DownshiftState<SearchItemType[]>,
      changes: StateChangeOptions<SearchItemType[]>
    ): StateChangeOptions<SearchItemType[]> => {
      const inputValue = changes.inputValue || ''
      const selectedItems = state.selectedItem || []
      const selectedOptions = uniqBy([...selectedItems, ...cachedResults], 'id')
      const selectedItem = getSelectedItemsByInput(inputValue, selectedOptions)
      const inputValueFromSelection = parseSelectionToInput(selectedItem)
      const cursorPosition = calculateCursorPosition(
        changes.inputValue || '',
        state.inputValue || ''
      )

      if (!inputValue && !selectedItem.length) {
        onChange(selectedItem)
      }
      dispatch({ type: 'setCursorPosition', payload: cursorPosition })

      // Don't select any suggestion if there isn't anything written
      const differences = inputValue.trim().replace(inputValueFromSelection.trim(), '')
      const highlightedIndex = differences === '' || differences === ',' ? null : 0

      return {
        ...changes,
        selectedItem,
        highlightedIndex,
        isOpen: inputValue !== '',
      }
    },
    [cachedResults, dispatch, onChange]
  )

  const stateReducer = useCallback(
    (
      state: DownshiftState<SearchItemType[]>,
      changes: StateChangeOptions<SearchItemType[]>
    ): StateChangeOptions<SearchItemType[]> => {
      switch (changes.type as any) {
        case Downshift.stateChangeTypes.keyDownEnter:
        case Downshift.stateChangeTypes.clickItem: {
          return handleConfirmSelection(state, changes)
        }
        case 'keyDownComa': {
          return handleConfirmSelection(state, changes, '')
        }
        case 'externalChanges': {
          return handleExternalChanges(state, changes)
        }
        case Downshift.stateChangeTypes.changeInput: {
          return handleChangeInput(state, changes)
        }
        case Downshift.stateChangeTypes.mouseUp:
        case Downshift.stateChangeTypes.blurInput:
        case Downshift.stateChangeTypes.keyDownEscape: {
          onChange(state.selectedItem || [])
          if (changes.type === Downshift.stateChangeTypes.blurInput && onBlur) {
            onBlur()
          }
          return {
            ...changes,
            inputValue: changes.inputValue || state.inputValue || '',
            selectedItem: changes.selectedItem || state.selectedItem || [],
          }
        }
        default:
          // Avoids warning on uncontrolled input value
          return {
            ...changes,
            inputValue: changes.inputValue || state.inputValue || '',
            selectedItem: changes.selectedItem || state.selectedItem || [],
          }
      }
    },
    [handleChangeInput, handleConfirmSelection, handleExternalChanges, onBlur, onChange]
  )

  const customEventHandler = useCallback(
    (event: any, downshift: any) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.type === 'click') {
        const cursorPosition = event.target.selectionStart
        dispatch({ type: 'setCursorPosition', payload: cursorPosition })
      }
      const { highlightedIndex, inputValue, setState } = downshift
      const hasValue = inputValue !== '' && inputValue !== ' '
      const isSpace = event.key === ' '
      const isComma = event.key === ','
      const hasOneOptions = results.length === 1
      if (hasValue && (isSpace || isComma) && hasOneOptions) {
        event.nativeEvent.preventDownshiftDefault = true
        if (highlightedIndex !== null && highlightedIndex >= 0) {
          const selectedItem = results[highlightedIndex]
          if (selectedItem) {
            setState({
              type: 'keyDownComa',
              selectedItem,
              inputValue,
            })
          }
        }
      }
    },
    [dispatch, results]
  )

  const itemToString = useCallback((i: SearchItem | null): string => {
    return i ? i.label : ''
  }, [])

  const initialInputValue = useMemo((): string => {
    return selectedItems !== null ? parseSelectionToInput(selectedItems) : ''
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (downshiftRef.current !== null) {
      const { setState } = downshiftRef.current
      setState({
        type: 'externalChanges',
        selectedItem: selectedItems,
      })
    }
  }, [selectedItems])

  const onOuterClick = useCallback(
    (state: DownshiftState<SearchItemType[] | null> | { selectedItem: SearchItemType[] }) => {
      onChange(state.selectedItem || [])
    },
    [onChange]
  )

  return (
    <SearchComponent
      items={results}
      loading={loading}
      onOuterClick={onOuterClick}
      setDownshiftRef={setDownshiftRef}
      downshiftRefLoaded={downshiftRef.current !== null}
      itemToString={itemToString}
      stateReducer={stateReducer}
      initialSelection={selectedItems}
      initialInputValue={initialInputValue}
      customEventHandler={customEventHandler}
      onStateChange={handleStateChange}
      onFocus={onFocus}
    />
  )
}

export default SearchContainer
