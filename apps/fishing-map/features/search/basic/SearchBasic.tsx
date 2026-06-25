import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useIntersectionObserver } from '@researchgate/react-intersection-observer'
import cx from 'classnames'
import Downshift from 'downshift'
import { useDebouncedCallback } from 'use-debounce'

import { InputText, Spinner } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import SearchBasicResultList from 'features/search/basic/SearchBasicResultList'
import { MIN_SEARCH_CHARACTERS, RESULTS_PER_PAGE } from 'features/search/search.config'
import { selectSearchQuery } from 'features/search/search.config.selectors'
import { useSearchConnect } from 'features/search/search.hook'
import { isBasicSearchAllowed, selectBasicSearchDatasets } from 'features/search/search.selectors'
import {
  selectSearchResults,
  selectSearchStatus,
  selectSelectedVessels,
  setSelectedVessels,
  setSuggestionClicked,
} from 'features/search/search.slice'
import { getSearchVesselId } from 'features/search/search.utils'
import {
  SearchEmptyState,
  SearchNoResultsState,
  SearchNotAllowed,
} from 'features/search/SearchPlaceholders'
import { PRIVATE_SEARCH_DATASET_BY_GROUP } from 'features/user/user.config'
import type { IdentityVesselData } from 'features/vessel/vessel.slice'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { useReplaceQueryParams } from 'router/routes.hook'
import { AsyncReducerStatus } from 'utils/async-slice'

import SearchError from './SearchError'

import styles from './SearchBasic.module.css'

export type SearchComponentProps = {
  onSuggestionClick?: () => void
  fetchMoreResults: () => void
  fetchResults?: () => void
  cleanResults?: () => void
  debouncedQuery?: string
}

function SearchBasic({
  onSuggestionClick,
  fetchMoreResults,
  debouncedQuery,
}: SearchComponentProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const { searchPagination, searchSuggestion, searchSuggestionClicked } = useSearchConnect()
  const searchQuery = useSelector(selectSearchQuery)
  const [inputValue, setInputValue] = useState(searchQuery || '')
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery)
  const basicSearchAllowed = useSelector(isBasicSearchAllowed)
  const searchResults = useSelector(selectSearchResults)
  const searchStatus = useSelector(selectSearchStatus)
  const vesselsSelected = useSelector(selectSelectedVessels)
  const basicSearchDatasets = useSelector(selectBasicSearchDatasets)
  const isBrazilVMSWorkspace =
    basicSearchDatasets !== undefined &&
    basicSearchDatasets.length > 0 &&
    basicSearchDatasets.some((d) => d.id === PRIVATE_SEARCH_DATASET_BY_GROUP.brazil[0])
  const hasMoreResults =
    searchPagination.total !== 0 &&
    searchPagination.total > RESULTS_PER_PAGE &&
    searchPagination.since &&
    searchResults?.length < searchPagination.total

  const debouncedReplaceQuery = useDebouncedCallback(
    (value: string) => replaceQueryParams({ query: value }),
    300
  )

  if (prevSearchQuery !== searchQuery && !debouncedReplaceQuery.isPending()) {
    setPrevSearchQuery(searchQuery)
    setInputValue(searchQuery || '')
  }

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setInputValue(value)
      debouncedReplaceQuery(value)
      if (value !== searchQuery && searchSuggestionClicked) {
        dispatch(setSuggestionClicked(false))
      }
    },
    [dispatch, searchQuery, searchSuggestionClicked, debouncedReplaceQuery]
  )

  const handleIntersection = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        fetchMoreResults()
      }
    },
    [fetchMoreResults]
  )
  const [spinnerRef] = useIntersectionObserver(handleIntersection, { rootMargin: '100px' })

  const placeholderFieldsLabel = isBrazilVMSWorkspace
    ? t((t) => t.search.mainQueryLabelPrivateVMSBrazil)
    : t((t) => t.search.mainQueryLabel)

  return (
    <Downshift
      onSelect={(selectedItem: IdentityVesselData | null) => {
        if (selectedItem) {
          dispatch(setSelectedVessels([getSearchVesselId(selectedItem)]))
        }
      }}
      itemToString={(item) => (item ? getVesselProperty(item, 'shipname') : '')}
    >
      {({ getInputProps, getMenuProps, highlightedIndex, setHighlightedIndex }) => (
        <div>
          <div className={styles.form}>
            <InputText
              {...getInputProps()}
              onChange={onInputChange}
              value={inputValue}
              autoFocus
              disabled={!basicSearchAllowed}
              className={styles.input}
              testId="search-vessels-basic-input"
              type="search"
              loading={
                searchStatus === AsyncReducerStatus.Loading ||
                searchStatus === AsyncReducerStatus.Aborted
              }
              placeholder={`${t((t) => t.search.placeholder)} (${placeholderFieldsLabel})`}
            />
          </div>
          <div className={styles.scrollContainer}>
            {basicSearchAllowed ? (
              <ul
                {...getMenuProps()}
                className={styles.searchResults}
                data-test="search-vessels-list"
              >
                {debouncedQuery && debouncedQuery?.length < MIN_SEARCH_CHARACTERS && (
                  <li key="suggestion" className={cx(styles.searchSuggestion, styles.red)}>
                    {t((t) => t.search.minCharacters, {
                      count: MIN_SEARCH_CHARACTERS,
                    })}
                  </li>
                )}
                {searchQuery &&
                  searchSuggestion &&
                  searchSuggestion !== searchQuery &&
                  !searchSuggestionClicked && (
                    <li key="suggestion" className={cx(styles.searchSuggestion)}>
                      {t((t) => t.search.suggestion)}{' '}
                      <button onClick={onSuggestionClick} className={styles.suggestion}>
                        {' '}
                        {searchSuggestion}{' '}
                      </button>{' '}
                      ?
                    </li>
                  )}
                <SearchBasicResultList
                  searchResults={searchResults}
                  highlightedIndex={highlightedIndex as number}
                  setHighlightedIndex={setHighlightedIndex}
                  vesselsSelected={vesselsSelected}
                  highlightQuery={debouncedQuery || ''}
                />
                {hasMoreResults && (
                  <li key="spinner" className={styles.spinner} ref={spinnerRef}>
                    <Spinner inline size="small" />
                  </li>
                )}

                {(searchStatus === AsyncReducerStatus.Loading ||
                  searchStatus === AsyncReducerStatus.Aborted ||
                  (!hasMoreResults && searchStatus === AsyncReducerStatus.Idle)) && (
                  <SearchEmptyState />
                )}

                {searchStatus === AsyncReducerStatus.Finished && !hasMoreResults && (
                  <SearchNoResultsState className={styles.noMoreResults} />
                )}
                {searchStatus === AsyncReducerStatus.Error && <SearchError />}
              </ul>
            ) : (
              <SearchNotAllowed />
            )}
          </div>
        </div>
      )}
    </Downshift>
  )
}

export default SearchBasic
