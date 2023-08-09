import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import { ChangeEvent, useCallback } from 'react'
import { Button, IconButton, InputText } from '@globalfishingwatch/ui-components'
import { useEventKeyListener } from '@globalfishingwatch/react-hooks'
import LocalStorageLoginLink from 'routes/LoginLink'
import { AsyncReducerStatus } from 'utils/async-slice'
import SearchAdvancedResults from 'features/search/SearchAdvancedResults'
import { SearchComponentProps } from 'features/search/SearchBasic'
import { useLocationConnect } from 'routes/routes.hook'
import { selectSearchQuery } from 'features/search/search.config.selectors'
import { EMPTY_FILTERS } from 'features/search/search.config'
import { selectSearchStatus, selectSearchStatusCode } from './search.slice'
import styles from './SearchAdvanced.module.css'
import SearchAdvancedFilters from './SearchAdvancedFilters'
import { useSearchConnect, useSearchFiltersConnect } from './search.hook'
import SearchPlaceholder, { SearchNoResultsState, SearchEmptyState } from './SearchPlaceholders'
import { isAdvancedSearchAllowed } from './search.selectors'

function SearchAdvanced({ onSuggestionClick, fetchMoreResults, onConfirm }: SearchComponentProps) {
  const { t } = useTranslation()
  const { searchPagination, searchSuggestion, searchSuggestionClicked } = useSearchConnect()
  const advancedSearchAllowed = useSelector(isAdvancedSearchAllowed)
  const searchStatus = useSelector(selectSearchStatus)
  const searchQuery = useSelector(selectSearchQuery)
  const searchStatusCode = useSelector(selectSearchStatusCode)
  const { dispatchQueryParams } = useLocationConnect()
  const { hasFilters } = useSearchFiltersConnect()
  const ref = useEventKeyListener(['Enter'], onConfirm)

  const resetSearchState = useCallback(() => {
    dispatchQueryParams(EMPTY_FILTERS)
  }, [dispatchQueryParams])

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

  return (
    <div className={styles.advancedLayout}>
      <div className={styles.form}>
        <div className={styles.formFields} ref={ref}>
          <InputText
            onChange={handleSearchQueryChange}
            id="name"
            value={searchQuery || ''}
            label={t('common.name', 'Name')}
            inputSize="small"
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
            onClick={onConfirm}
            disabled={!hasFilters && !searchQuery}
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
        {(searchStatus === AsyncReducerStatus.Loading ||
          searchStatus === AsyncReducerStatus.Aborted) &&
        searchPagination.loading === false ? null : (
          <div className={styles.searchResults}>
            <SearchAdvancedResults fetchMoreResults={fetchMoreResults} />
            {searchStatus === AsyncReducerStatus.Idle && <SearchEmptyState />}
            {searchStatus === AsyncReducerStatus.Finished && searchPagination.total === 0 && (
              <SearchNoResultsState />
            )}
            {searchStatus === AsyncReducerStatus.Error && (
              <p className={styles.error}>
                {searchStatusCode === 404
                  ? t(
                      'search.noResults',
                      "Can't find the vessel you are looking for? Try using MMSI, IMO or Callsign"
                    )
                  : t('errors.genericShort', 'Something went wrong')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchAdvanced
