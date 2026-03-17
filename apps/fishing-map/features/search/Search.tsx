import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { isAuthError } from '@globalfishingwatch/api-client'
import { Spinner } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectDatasetsError, selectDatasetsStatus } from 'features/datasets/datasets.slice'
import I18nNumber from 'features/i18n/i18nNumber'
import SearchAdvanced from 'features/search/advanced/SearchAdvanced'
import SearchBasic from 'features/search/basic/SearchBasic'
import { selectSearchOption } from 'features/search/search.config.selectors'
import { useSearch, useSearchConnect } from 'features/search/search.hook'
import { isAdvancedSearchAllowed, isBasicSearchAllowed } from 'features/search/search.selectors'
import {
  cleanVesselSearchResults,
  selectSearchPagination,
  selectSearchResults,
  selectSelectedVessels,
  setSuggestionClicked,
} from 'features/search/search.slice'
import SearchActions from 'features/search/SearchActions'
import SearchDownload from 'features/search/SearchDownload'
import SearchPlaceholder, { SearchNotAllowed } from 'features/search/SearchPlaceholders'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import WorkspaceLoginError from 'features/workspace/WorkspaceLoginError'
import { useReplaceQueryParams } from 'router/routes.hook'
import { selectWorkspaceId } from 'router/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './Search.module.css'

function Search() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const urlWorkspaceId = useSelector(selectWorkspaceId)
  const basicSearchAllowed = useSelector(isBasicSearchAllowed)
  const advancedSearchAllowed = useSelector(isAdvancedSearchAllowed)
  const searchResults = useSelector(selectSearchResults)
  const { searchSuggestion } = useSearchConnect()
  const { debouncedQuery, fetchMoreResults, onAdvancedSearchClick } = useSearch()
  const activeSearchOption = useSelector(selectSearchOption)
  const searchResultsPagination = useSelector(selectSearchPagination)
  const vesselsSelected = useSelector(selectSelectedVessels)
  const [vesselsSelectedDownload, setVesselsSelectedDownload] = useState([])

  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const guestUser = useSelector(selectIsGuestUser)
  const datasetError = useSelector(selectDatasetsError)

  useEffect(() => {
    dispatch(fetchWorkspaceThunk({ workspaceId: urlWorkspaceId as string }))
  }, [dispatch, urlWorkspaceId])

  useEffect(() => {
    if (debouncedQuery === '') {
      dispatch(cleanVesselSearchResults())
    }
    replaceQueryParams({ query: debouncedQuery })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  useEffect(() => {
    // State cleanup needed to avoid sluggist renders when there are lots of vessels
    if (vesselsSelectedDownload.length) {
      setVesselsSelectedDownload([])
    }
  }, [vesselsSelectedDownload.length])

  const onSuggestionClick = () => {
    if (searchSuggestion) {
      dispatch(setSuggestionClicked(true))
      replaceQueryParams({ query: searchSuggestion })
    }
  }

  const isWorkspaceError = workspaceStatus === AsyncReducerStatus.Error
  const isDatasetError = datasetsStatus === AsyncReducerStatus.Error

  if (isWorkspaceError || isDatasetError) {
    return isAuthError(datasetError) ? (
      <WorkspaceLoginError
        title={
          guestUser
            ? t((t) => t.errors.searchLogin)
            : t((t) => t.errors.privateSearch, {
                defaultValue: "Your account doesn't have permissions to search on these datasets",
              })
        }
        emailSubject={`Requesting access for searching vessels`}
      />
    ) : (
      <SearchNotAllowed />
    )
  }

  const showWorkspaceSpinner = workspaceStatus !== AsyncReducerStatus.Finished
  const showDatasetsSpinner = datasetsStatus !== AsyncReducerStatus.Finished

  if (showWorkspaceSpinner || showDatasetsSpinner) {
    return (
      <SearchPlaceholder>
        <Spinner />
      </SearchPlaceholder>
    )
  }

  const SearchComponent = activeSearchOption === 'basic' ? SearchBasic : SearchAdvanced

  return (
    <div className={styles.search}>
      <SearchComponent
        onSuggestionClick={onSuggestionClick}
        fetchMoreResults={fetchMoreResults}
        fetchResults={onAdvancedSearchClick}
        debouncedQuery={debouncedQuery}
      />
      <div
        className={cx(styles.footer, styles[activeSearchOption], {
          [styles.hidden]:
            !searchResultsPagination ||
            searchResultsPagination.total === 0 ||
            (activeSearchOption === 'basic' && !basicSearchAllowed) ||
            (activeSearchOption === 'advanced' && !advancedSearchAllowed),
        })}
      >
        {searchResults && searchResults.length !== 0 && (
          <label className={styles.results}>
            {`${t((t) => t.search.seeing)} `}
            <I18nNumber number={searchResults.length} />
            {` ${t((t) => t.common.of)} `}
            <I18nNumber number={searchResultsPagination.total} />
            {` ${t((t) => t.search.results)} ${
              vesselsSelected.length !== 0
                ? `(${vesselsSelected.length} ${t((t) => t.selects.selected)})`
                : ''
            }`}
          </label>
        )}
        {activeSearchOption === 'advanced' && <SearchDownload />}
        <SearchActions />
      </div>
    </div>
  )
}

export default Search
