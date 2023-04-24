import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { Button, IconButton, InputText } from '@globalfishingwatch/ui-components'
import LocalStorageLoginLink from 'routes/LoginLink'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useAppDispatch } from 'features/app/app.hooks'
import SearchAdvancedResults from 'features/search/SearchAdvancedResults'
import { SearchComponentProps } from 'features/search/SearchBasic'
import { resetFilters, selectSearchStatus, selectSearchStatusCode } from './search.slice'
import styles from './SearchAdvanced.module.css'
import SearchFilters from './SearchFilters'
import { useSearchConnect } from './search.hook'
import SearchPlaceholder, {
  SearchNotAllowed,
  SearchNoResultsState,
  SearchEmptyState,
} from './SearchPlaceholders'
import {
  isBasicSearchAllowed,
  isAdvancedSearchAllowed,
  selectAdvancedSearchDatasets,
} from './search.selectors'

const MIN_SEARCH_CHARACTERS = 3

function SearchAdvanced({
  onSuggestionClick,
  fetchMoreResults,
  setSearchQuery,
  searchQuery,
  debouncedQuery,
  onConfirm,
}: SearchComponentProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { searchPagination, searchSuggestion, searchSuggestionClicked } = useSearchConnect()
  const basicSearchAllowed = useSelector(isBasicSearchAllowed)
  const advancedSearchAllowed = useSelector(isAdvancedSearchAllowed)
  const searchStatus = useSelector(selectSearchStatus)
  const searchStatusCode = useSelector(selectSearchStatusCode)
  const searchDatasets = useSelector(selectAdvancedSearchDatasets)

  const resetSearchState = useCallback(() => {
    setSearchQuery('')
    dispatch(resetFilters())
  }, [setSearchQuery, dispatch])

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

  return (
    <div className={styles.advancedLayout}>
      <div className={styles.form}>
        <div className={styles.formFields}>
          <InputText
            onChange={(e) => setSearchQuery(e.target.value)}
            id="name"
            value={searchQuery}
            label={t('common.name', 'Name')}
            inputSize="small"
            className={styles.input}
            autoFocus
          />
          <SearchFilters className={styles.filters} datasets={searchDatasets} />
          {debouncedQuery && debouncedQuery?.length < MIN_SEARCH_CHARACTERS && (
            <div className={styles.red}>
              {t('search.minCharacters', {
                defaultValue: 'Please type at least {{count}} characters',
                count: MIN_SEARCH_CHARACTERS,
              })}
            </div>
          )}
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
        searchPagination.loading === false ? null : basicSearchAllowed ? (
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
        ) : (
          <SearchNotAllowed />
        )}
      </div>
    </div>
  )
}

export default SearchAdvanced
