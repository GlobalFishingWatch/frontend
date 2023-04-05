import { useSelector } from 'react-redux'
import cx from 'classnames'
import Downshift from 'downshift'
import { Trans, useTranslation } from 'react-i18next'
import { InputText, Spinner } from '@globalfishingwatch/ui-components'
import LocalStorageLoginLink from 'routes/LoginLink'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useAppDispatch } from 'features/app/app.hooks'
import SearchResults from 'features/search/SearchResults'
import {
  selectSearchResults,
  selectSearchStatus,
  selectSearchStatusCode,
  RESULTS_PER_PAGE,
  setSuggestionClicked,
} from './search.slice'
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
  onSelect,
  spinnerRef,
  setSearchQuery,
  searchQuery,
  debouncedQuery,
  vesselsSelected,
  setVesselsSelected,
}) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { searchPagination, searchSuggestion, searchSuggestionClicked } = useSearchConnect()
  const basicSearchAllowed = useSelector(isBasicSearchAllowed)
  const advancedSearchAllowed = useSelector(isAdvancedSearchAllowed)
  const searchResults = useSelector(selectSearchResults)
  const searchStatus = useSelector(selectSearchStatus)
  const searchStatusCode = useSelector(selectSearchStatusCode)
  const searchDatasets = useSelector(selectAdvancedSearchDatasets)

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setVesselsSelected([])
    if (e.target.value !== searchQuery && searchSuggestionClicked) {
      dispatch(setSuggestionClicked(false))
    }
  }

  const hasMoreResults =
    searchPagination.total !== 0 &&
    searchPagination.total > RESULTS_PER_PAGE &&
    searchPagination.offset &&
    searchPagination.offset <= searchPagination.total

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
    <Downshift onSelect={onSelect} itemToString={(item) => (item ? item.shipname : '')}>
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.advancedLayout}>
          <div className={styles.form}>
            <InputText
              {...getInputProps()}
              onChange={onInputChange}
              value={searchQuery}
              label={t('search.mainQueryLabel', 'Name, IMO or MMSI')}
              autoFocus
              disabled={!basicSearchAllowed}
              className={styles.input}
              type="search"
              loading={
                searchStatus === AsyncReducerStatus.Loading ||
                searchStatus === AsyncReducerStatus.Aborted
              }
              placeholder={t('search.placeholder', 'Type to search vessels')}
            />
            <SearchFilters className={styles.filters} datasets={searchDatasets} />
          </div>
          <div className={styles.scrollContainer}>
            {(searchStatus === AsyncReducerStatus.Loading ||
              searchStatus === AsyncReducerStatus.Aborted) &&
            searchPagination.loading === false ? null : basicSearchAllowed ? (
              <ul {...getMenuProps()} className={styles.searchResults}>
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
                <SearchResults
                  searchResults={searchResults}
                  highlightedIndex={highlightedIndex}
                  getItemProps={getItemProps}
                  vesselsSelected={vesselsSelected}
                />
                {hasMoreResults && (
                  <li key="spinner" className={styles.spinner} ref={spinnerRef}>
                    <Spinner inline size="small" />
                  </li>
                )}

                {searchStatus === AsyncReducerStatus.Idle && <SearchEmptyState />}
                {searchStatus === AsyncReducerStatus.Finished && !hasMoreResults && (
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

export default SearchAdvanced
