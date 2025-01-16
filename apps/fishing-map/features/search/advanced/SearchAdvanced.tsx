import type { ChangeEvent } from 'react'
import { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'

import { useEventKeyListener } from '@globalfishingwatch/react-hooks'
import { Button, IconButton, InputText } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import styles from 'features/search/advanced/SearchAdvanced.module.css'
import SearchAdvancedFilters from 'features/search/advanced/SearchAdvancedFilters'
import type { SearchComponentProps } from 'features/search/basic/SearchBasic'
import { EMPTY_FILTERS } from 'features/search/search.config'
import { selectSearchQuery } from 'features/search/search.config.selectors'
import {
  useSearchConnect,
  useSearchFiltersConnect,
  useSearchFiltersErrors,
} from 'features/search/search.hook'
import { isAdvancedSearchAllowed } from 'features/search/search.selectors'
import {
  cleanVesselSearchResults,
  selectSearchStatus,
  selectSearchStatusCode,
} from 'features/search/search.slice'
import SearchPlaceholder, {
  SearchEmptyState,
  SearchNoResultsState,
} from 'features/search/SearchPlaceholders'
import LocalStorageLoginLink from 'routes/LoginLink'
import { useLocationConnect } from 'routes/routes.hook'
import { AsyncReducerStatus } from 'utils/async-slice'

import SearchError from '../basic/SearchError'

const SearchAdvancedResults = dynamic(
  () => import(/* webpackChunkName: "SearchAdvancedResults" */ './SearchAdvancedResults')
)

function SearchAdvanced({
  onSuggestionClick,
  fetchMoreResults,
  fetchResults,
}: SearchComponentProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { searchPagination, searchSuggestion, searchSuggestionClicked } = useSearchConnect()
  const advancedSearchAllowed = useSelector(isAdvancedSearchAllowed)
  const searchStatus = useSelector(selectSearchStatus)
  const searchQuery = useSelector(selectSearchQuery)
  const searchStatusCode = useSelector(selectSearchStatusCode)
  const { dispatchQueryParams } = useLocationConnect()
  const { hasFilters } = useSearchFiltersConnect()
  const searchFilterErrors = useSearchFiltersErrors()
  const ref = useEventKeyListener(['Enter'], fetchResults)

  const resetSearchState = useCallback(() => {
    dispatchQueryParams(EMPTY_FILTERS)
    dispatch(cleanVesselSearchResults())
  }, [dispatch, dispatchQueryParams])

  if (!advancedSearchAllowed) {
    return (
      <SearchPlaceholder>
        <Trans i18nKey="search.advancedDisabled">
          You need to
          <LocalStorageLoginLink className={styles.link}>login</LocalStorageLoginLink>
          to use advanced search
        </Trans>
      </SearchPlaceholder>
    )
  }

  const handleSearchQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatchQueryParams({ query: e.target.value })
  }

  const hasSearchFilterErrors = Object.keys(searchFilterErrors).length > 0

  return (
    <div className={styles.advancedLayout}>
      <div className={styles.form}>
        <div className={styles.formFields} ref={ref}>
          <InputText
            onChange={handleSearchQueryChange}
            id="name"
            value={searchQuery || ''}
            label={t('common.name', 'Name')}
            className={styles.input}
            autoFocus
          />
          <SearchAdvancedFilters />
          {searchQuery &&
            searchSuggestion &&
            searchSuggestion !== searchQuery &&
            !searchSuggestionClicked && (
              <div>
                {t('search.suggestion', 'Did you mean')}{' '}
                <button onClick={onSuggestionClick} className={styles.suggestion}>
                  {' '}
                  {searchSuggestion}{' '}
                </button>{' '}
                ?
              </div>
            )}
        </div>
        <div className={styles.formFooter}>
          <IconButton type="border" size="medium" icon="delete" onClick={resetSearchState} />
          <Button
            className={styles.confirmButton}
            onClick={fetchResults}
            disabled={
              (!hasFilters && !searchQuery) || hasSearchFilterErrors || searchStatusCode === 401
            }
            tooltip={
              hasSearchFilterErrors
                ? t(
                    'search.notValidFilterSelection',
                    "At least one of your selected sources doesn't allow one of your filters"
                  )
                : ''
            }
            loading={
              searchStatus === AsyncReducerStatus.Loading ||
              searchStatus === AsyncReducerStatus.Aborted
            }
          >
            {t('search.title', 'Search')}
          </Button>
        </div>
      </div>
      <div className={styles.scrollContainer}>
        {searchStatus === AsyncReducerStatus.Aborted &&
        searchPagination.loading === false ? null : (
          <div className={styles.searchResults}>
            <SearchAdvancedResults
              fetchResults={fetchResults}
              fetchMoreResults={fetchMoreResults}
            />
            {(searchStatus === AsyncReducerStatus.Idle ||
              searchStatus === AsyncReducerStatus.Loading) && <SearchEmptyState />}
            {searchStatus === AsyncReducerStatus.Finished && searchPagination.total === 0 && (
              <SearchNoResultsState />
            )}
            {searchStatus === AsyncReducerStatus.Error && <SearchError />}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchAdvanced
