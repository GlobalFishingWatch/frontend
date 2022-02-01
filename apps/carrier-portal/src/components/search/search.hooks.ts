import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import { useEffect, useReducer } from 'react'
import { event as uaEvent } from 'react-ga'
import { matchSorter, rankings } from 'match-sorter'
import uniqBy from 'lodash/uniqBy'
import memoizeOne from 'memoize-one'
import { useDispatch } from 'react-redux'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { SearchItemType } from 'types/app.types'
import { PaginatedVesselSearch } from 'types/api/models'
import { SEARCH_ASYNC_FIELDS, SEARCH_TYPES } from 'data/constants'
import { parseVesselSearchResponse } from 'utils'
import { userLogout } from 'redux-modules/user/user.actions'
import usePrevious from 'hooks/previous.hooks'
import { replaceWithNormalSpaces, getInputFields } from './search.utils'

const searchTypesList = Object.values(SEARCH_TYPES)

const parseSearchFieldsInput = (
  input: string,
  selectedItems: SearchItemType[],
  cursorPosition: number
): string[] => {
  const selectedItemTypes = (selectedItems && selectedItems.map((i) => i.type)) || []
  const selectedItemLabels = (selectedItems && selectedItems.map((i) => i.label)) || []
  const existingSearchTypes: { [type: string]: boolean } = {}

  const searchFields = getInputFields(input)
    // Space replacement needs to be done after splitting by regular spaces
    .map(replaceWithNormalSpaces)
    .filter((v) => {
      if (selectedItemTypes.includes(v)) {
        // Needed when search by type with a current type filter added
        if (!existingSearchTypes[v]) {
          existingSearchTypes[v] = true
          return false
        } else {
          return true
        }
      }
      return !selectedItemLabels.includes(v)
    })

  let previousColonPosition = 0
  for (let i = cursorPosition; i > 0; i--) {
    if (input[i] === ':') {
      previousColonPosition = i
      break
    }
  }
  const isSearchingInType =
    input.slice(previousColonPosition, cursorPosition + 1).indexOf(' ') === -1

  if (isSearchingInType) {
    let currentTypeStartIndex = 0
    for (let i = previousColonPosition; i > 0; i--) {
      if (input[i] === ' ') {
        currentTypeStartIndex = i + 1
        break
      }
    }
    const currentType = input.slice(currentTypeStartIndex, previousColonPosition)
    if (currentType) {
      searchFields.push(currentType)
    }
  }
  return Array.from(new Set(searchFields))
}

const filterOptionBySearchFields = memoizeOne(
  (searchFields: string[], itemsNotSelected: SearchItemType[]) =>
    searchFields.reduce((acc, cleanValue) => {
      return matchSorter(acc, cleanValue, {
        keys: [
          { key: 'type', threshold: rankings.EQUAL },
          { key: 'label', threshold: rankings.ACRONYM },
          { key: 'alias', threshold: rankings.CONTAINS },
        ],
      })
    }, itemsNotSelected)
)

const filterItemsNotSelected = memoizeOne((items: SearchItemType[], selectedItemIds: string[]) => {
  return selectedItemIds.length > 0 ? items.filter((i) => !selectedItemIds.includes(i.id)) : items
})

const getItemsFiltered = (
  items: SearchItemType[],
  input: string,
  selectedItems: SearchItemType[],
  cursorPosition: number
): SearchItemType[] => {
  if (!input) return items
  const selectedItemIds = (selectedItems && selectedItems.map((i) => i.id)) || []

  const searchFields = parseSearchFieldsInput(input, selectedItems, cursorPosition)
  const itemsNotSelected = filterItemsNotSelected(items, selectedItemIds)
  const results = filterOptionBySearchFields(searchFields, itemsNotSelected)
  return results
}

interface ResultsAction {
  type: 'inputChange' | 'staticOptionsChange' | 'startSearch' | 'endSearch' | 'setCursorPosition'
  payload?: any
}

interface ResultsState {
  loading: boolean
  staticData: SearchItemType[]
  selectedItem: SearchItemType[]
  cursorPosition: number
  search: string
  results: SearchItemType[]
  cachedResults: SearchItemType[]
}

export const useResultsFiltered = (
  staticData: SearchItemType[],
  initialValue?: string,
  searchUrl?: string
): any => {
  const initialState: ResultsState = {
    loading: false,
    staticData,
    selectedItem: [],
    cursorPosition: 0, // Calculated on init render
    search: initialValue || '',
    results: staticData, // Filter if initial value exists
    cachedResults: staticData,
  }
  const resultsReducer = (state: ResultsState, action: ResultsAction): ResultsState => {
    switch (action.type) {
      case 'inputChange': {
        return {
          ...state,
          search: action.payload.search,
          selectedItem: action.payload.selectedItem,
        }
      }
      case 'staticOptionsChange':
        return {
          ...state,
          staticData: action.payload,
        }
      case 'setCursorPosition':
        return { ...state, cursorPosition: action.payload }
      case 'startSearch': {
        const { staticData, search, selectedItem, cursorPosition } = state
        return {
          ...state,
          results: getItemsFiltered(staticData, search, selectedItem, cursorPosition),
          loading: action.payload,
        }
      }
      case 'endSearch': {
        return {
          ...state,
          results: [...state.results, ...action.payload],
          cachedResults: uniqBy([...state.cachedResults, ...action.payload], 'id'),
          loading: false,
        }
      }
      default:
        return state
    }
  }
  const reduxDispatch = useDispatch()
  const [state, dispatch] = useReducer(resultsReducer, initialState)
  const { search, selectedItem, cursorPosition } = state
  const previousSearch = usePrevious(search)

  useEffect(() => {
    dispatch({ type: 'staticOptionsChange', payload: staticData })
  }, [staticData])

  useEffect(() => {
    // workaround to avoid duplicated requests
    if (search === previousSearch) return

    const searchFields = parseSearchFieldsInput(search, selectedItem, cursorPosition)
    const searchFieldsTypes = searchFields.filter((f) => searchTypesList.includes(f))
    const needsRequest =
      searchFieldsTypes.length === 0 ||
      searchFieldsTypes.some((r) => SEARCH_ASYNC_FIELDS.includes(r))
    const selectedItemIds =
      selectedItem !== null ? selectedItem.map((i: SearchItemType) => i.id) : []
    const selectedItemLabels =
      selectedItem !== null ? selectedItem.map((i: SearchItemType) => i.label) : []
    const searchQuery = searchFields
      .filter((f) => !selectedItemLabels.includes(f) && !searchTypesList.includes(f))
      .join(' ')
    const asyncNeeded = needsRequest && searchQuery !== ''
    dispatch({ type: 'startSearch', payload: asyncNeeded })
    if (asyncNeeded && searchUrl) {
      const controller = new AbortController()
      const searchUrlWithQuery = searchUrl.replace('{{searchQuery}}', searchQuery)
      const isNumericSearch = /^\d+$/.test(searchQuery)
      GFWAPI.fetch<PaginatedVesselSearch>(searchUrlWithQuery, { signal: controller.signal })
        .then((data) => {
          const apiResults = parseVesselSearchResponse(data, { useSuggestions: !isNumericSearch })
            .map((d) => ({ ...d, type: 'vessel' }))
            .filter((d) => !selectedItemIds.includes(d.id))

          dispatch({ type: 'endSearch', payload: apiResults })
          uaEvent({
            category: 'CVP - Search Vessel',
            action: 'Basic search',
            label: searchQuery,
            value: apiResults.length,
          })
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Error fetching search asycn results', err)
          } else if (err.status > 400 && err.status < 403) {
            reduxDispatch(userLogout())
          } else {
            dispatch({ type: 'endSearch', payload: [] })
          }
        })
      return () => controller.abort()
    }
    // Only re run when input changes, not cursor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedItem, searchUrl, reduxDispatch])

  return [state, dispatch]
}
