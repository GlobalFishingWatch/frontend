import { useSelector } from 'react-redux'
import cx from 'classnames'
import { Trans, useTranslation } from 'react-i18next'
import { MutableRefObject } from 'react'
import { InputText, Spinner } from '@globalfishingwatch/ui-components'
import LocalStorageLoginLink from 'routes/LoginLink'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useAppDispatch } from 'features/app/app.hooks'
import SearchAdvancedResults from 'features/search/SearchAdvancedResults'
import {
  selectSearchStatus,
  selectSearchStatusCode,
  RESULTS_PER_PAGE,
  setSuggestionClicked,
  VesselWithDatasets,
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

type SearchAdvancedProps = {
  onSuggestionClick: () => void
  onSelect: (vessel: VesselWithDatasets) => void
  fetchMoreResults: () => void
  setSearchQuery: (query: string) => void
  searchQuery: string
  debouncedQuery: string
  vesselsSelected: VesselWithDatasets[]
  setVesselsSelected: (vessels: VesselWithDatasets[]) => void
}

function SearchAdvanced({
  onSuggestionClick,
  onSelect,
  fetchMoreResults,
  setSearchQuery,
  searchQuery,
  debouncedQuery,
  vesselsSelected,
  setVesselsSelected,
}: SearchAdvancedProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { searchPagination, searchSuggestion, searchSuggestionClicked } = useSearchConnect()
  const basicSearchAllowed = useSelector(isBasicSearchAllowed)
  const advancedSearchAllowed = useSelector(isAdvancedSearchAllowed)
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
    <div className={styles.advancedLayout}>
      <div className={styles.form}>
        <InputText
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
          <div className={styles.searchResults}>
            {debouncedQuery && debouncedQuery?.length < MIN_SEARCH_CHARACTERS && (
              <div key="suggestion" className={cx(styles.searchSuggestion, styles.red)}>
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
                <div key="suggestion" className={cx(styles.searchSuggestion)}>
                  {t('search.suggestion', 'Did you mean')}{' '}
                  <button onClick={onSuggestionClick} className={styles.suggestion}>
                    {' '}
                    {searchSuggestion}{' '}
                  </button>{' '}
                  ?
                </div>
              )}
            <SearchAdvancedResults
              onSelect={onSelect}
              vesselsSelected={vesselsSelected}
              fetchMoreResults={fetchMoreResults}
              setVesselsSelected={setVesselsSelected}
            />
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
          </div>
        ) : (
          <SearchNotAllowed />
        )}
      </div>
    </div>
  )
}

export default SearchAdvanced
