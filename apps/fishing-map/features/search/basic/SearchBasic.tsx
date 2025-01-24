import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useIntersectionObserver } from '@researchgate/react-intersection-observer'
import cx from 'classnames'
import Downshift from 'downshift'

import { InputText, Spinner } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import SearchBasicResultList from 'features/search/basic/SearchBasicResultList'
import { MIN_SEARCH_CHARACTERS, RESULTS_PER_PAGE } from 'features/search/search.config'
import { selectSearchQuery } from 'features/search/search.config.selectors'
import { useSearchConnect } from 'features/search/search.hook'
import { isBasicSearchAllowed } from 'features/search/search.selectors'
import {
  selectSearchResults,
  selectSearchStatus,
  selectSelectedVessels,
  setSelectedVessels,
  setSuggestionClicked,
} from 'features/search/search.slice'
import {
  SearchEmptyState,
  SearchNoResultsState,
  SearchNotAllowed,
} from 'features/search/SearchPlaceholders'
import type { IdentityVesselData } from 'features/vessel/vessel.slice'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { useLocationConnect } from 'routes/routes.hook'
import { selectIsStandaloneSearchLocation } from 'routes/routes.selectors'
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
  const { searchPagination, searchSuggestion, searchSuggestionClicked } = useSearchConnect()
  const searchQuery = useSelector(selectSearchQuery)
  const basicSearchAllowed = useSelector(isBasicSearchAllowed)
  const isStandaloneSearchLocation = useSelector(selectIsStandaloneSearchLocation)
  const searchResults = useSelector(selectSearchResults)
  const searchStatus = useSelector(selectSearchStatus)
  const vesselsSelected = useSelector(selectSelectedVessels)
  const { dispatchQueryParams } = useLocationConnect()
  const hasMoreResults =
    searchPagination.total !== 0 &&
    searchPagination.total > RESULTS_PER_PAGE &&
    searchPagination.since &&
    searchResults?.length < searchPagination.total

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatchQueryParams({ query: e.target.value }, isStandaloneSearchLocation)
      if (e.target.value !== searchQuery && searchSuggestionClicked) {
        dispatch(setSuggestionClicked(false))
      }
    },
    [
      dispatch,
      dispatchQueryParams,
      isStandaloneSearchLocation,
      searchQuery,
      searchSuggestionClicked,
    ]
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

  return (
    <Downshift
      onSelect={(selectedItem: IdentityVesselData | null) => {
        if (selectedItem) {
          dispatch(setSelectedVessels([selectedItem?.id]))
        }
      }}
      itemToString={(item) => (item ? getVesselProperty(item, 'shipname') : '')}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex, setHighlightedIndex }) => (
        <div className={styles.scrollContainer}>
          <div className={styles.form}>
            <InputText
              {...getInputProps()}
              onChange={onInputChange}
              value={searchQuery || ''}
              autoFocus
              disabled={!basicSearchAllowed}
              className={styles.input}
              testId="seach-vessels-basic-input"
              type="search"
              loading={
                searchStatus === AsyncReducerStatus.Loading ||
                searchStatus === AsyncReducerStatus.Aborted
              }
              placeholder={`${t('search.placeholder', 'Type to search vessels')} (${t(
                'search.mainQueryLabel',
                'Name, IMO or MMSI'
              )})`}
            />
          </div>
          {searchStatus === AsyncReducerStatus.Aborted &&
          searchPagination.loading === false ? null : basicSearchAllowed ? (
            <ul
              {...getMenuProps()}
              className={styles.searchResults}
              data-test="search-vessels-list"
            >
              {debouncedQuery && debouncedQuery?.length < MIN_SEARCH_CHARACTERS && (
                <li key="suggestion" className={cx(styles.searchSuggestion, styles.red)}>
                  {t('search.minCharacters', {
                    defaultValue: 'Please type at least {{count}} characters',
                    count: MIN_SEARCH_CHARACTERS,
                  })}
                </li>
              )}
              {searchQuery &&
                searchSuggestion &&
                searchSuggestion !== searchQuery &&
                !searchSuggestionClicked && (
                  <li key="suggestion" className={cx(styles.searchSuggestion)}>
                    {t('search.suggestion', 'Did you mean')}{' '}
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
                getItemProps={getItemProps}
                vesselsSelected={vesselsSelected}
              />
              {hasMoreResults && (
                <li key="spinner" className={styles.spinner} ref={spinnerRef}>
                  <Spinner inline size="small" />
                </li>
              )}

              {(searchStatus === AsyncReducerStatus.Loading ||
                (!hasMoreResults && searchStatus === AsyncReducerStatus.Idle)) && (
                <SearchEmptyState />
              )}

              {searchStatus === AsyncReducerStatus.Finished && !hasMoreResults && (
                <SearchNoResultsState />
              )}
              {searchStatus === AsyncReducerStatus.Error && <SearchError />}
            </ul>
          ) : (
            <SearchNotAllowed />
          )}
        </div>
      )}
    </Downshift>
  )
}

export default SearchBasic
