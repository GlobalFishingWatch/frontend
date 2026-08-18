import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { isAuthError } from '@globalfishingwatch/api-client'
import { Spinner } from '@globalfishingwatch/ui-components'

import { selectDatasetsError, selectDatasetsStatus } from 'features/_map/datasets/datasets.slice'
import {
  selectIsWorkspaceRefreshing,
  selectWorkspaceStatus,
} from 'features/_map/workspace/workspace.selectors'
import WorkspaceLoginError from 'features/_map/workspace/WorkspaceLoginError'
import { selectIsGuestUser } from 'features/_user/selectors/user.selectors'
import SearchAdvanced from 'features/_vessels/search/advanced/SearchAdvanced'
import SearchBasic from 'features/_vessels/search/basic/SearchBasic'
import {
  selectSearchOption,
  selectSearchQuery,
} from 'features/_vessels/search/search.config.selectors'
import { useSearch, useSearchConnect } from 'features/_vessels/search/search.hook'
import {
  isAdvancedSearchAllowed,
  isBasicSearchAllowed,
} from 'features/_vessels/search/search.selectors'
import {
  cleanVesselSearchResults,
  selectSearchPagination,
  setSuggestionClicked,
} from 'features/_vessels/search/search.slice'
import SearchFooter from 'features/_vessels/search/SearchFooter'
import SearchPlaceholder from 'features/_vessels/search/SearchPlaceholders'
import { useAppDispatch } from 'features/app/app.hooks'
import { useReplaceQueryParams } from 'router/routes.hook'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './Search.module.css'

function Search() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const { searchSuggestion } = useSearchConnect()
  const { debouncedQuery, fetchMoreResults, onAdvancedSearchClick } = useSearch()
  const query = useSelector(selectSearchQuery)
  const activeSearchOption = useSelector(selectSearchOption)
  const searchResultsPagination = useSelector(selectSearchPagination)
  const basicSearchAllowed = useSelector(isBasicSearchAllowed)
  const advancedSearchAllowed = useSelector(isAdvancedSearchAllowed)
  const [vesselsSelectedDownload, setVesselsSelectedDownload] = useState([])
  const [ignoreSecondaryDatasetsLoading, setIgnoreSecondaryDatasetsLoading] = useState(false)

  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const isWorkspaceRefreshing = useSelector(selectIsWorkspaceRefreshing)
  const guestUser = useSelector(selectIsGuestUser)
  const datasetError = useSelector(selectDatasetsError)

  useEffect(() => {
    if (debouncedQuery === '' && query === '') {
      dispatch(cleanVesselSearchResults())
    }
  }, [debouncedQuery, dispatch, query])

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
        loginSource="search-private"
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
      <SearchPlaceholder>
        <p>{t((t) => t.search.workspaceError)}</p>
      </SearchPlaceholder>
    )
  }

  const isWorkspaceLoading = workspaceStatus !== AsyncReducerStatus.Finished
  const areDatasetsLoading = datasetsStatus !== AsyncReducerStatus.Finished
  const showSpinner = isWorkspaceLoading || (areDatasetsLoading && !isWorkspaceRefreshing)
  if (!showSpinner && !ignoreSecondaryDatasetsLoading) {
    setIgnoreSecondaryDatasetsLoading(true)
  }
  if (showSpinner && !ignoreSecondaryDatasetsLoading) {
    return (
      <SearchPlaceholder>
        <Spinner />
      </SearchPlaceholder>
    )
  }
  const SearchComponent = activeSearchOption === 'basic' ? SearchBasic : SearchAdvanced
  const footerVisible =
    Boolean(searchResultsPagination?.total) &&
    (activeSearchOption === 'basic' ? basicSearchAllowed : advancedSearchAllowed)

  return (
    <div className={styles.search}>
      <SearchComponent
        onSuggestionClick={onSuggestionClick}
        fetchMoreResults={fetchMoreResults}
        fetchResults={onAdvancedSearchClick}
        debouncedQuery={debouncedQuery}
        footer={footerVisible ? <SearchFooter /> : undefined}
      />
    </div>
  )
}

export default Search
