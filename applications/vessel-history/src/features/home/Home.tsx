import React, { Fragment, useCallback, useEffect, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Link from 'redux-first-router-link'
import cx from 'classnames'
import { VesselSearch } from '@globalfishingwatch/api-types'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import { Spinner, IconButton, Button, Choice } from '@globalfishingwatch/ui-components'
import { ChoiceOption } from '@globalfishingwatch/ui-components/dist/choice'
import { RESULTS_PER_PAGE } from 'data/constants'
import { logoutUserThunk } from 'features/user/user.slice'
import VesselListItem from 'features/vessel-list-item/VesselListItem'
import { useOfflineVesselsAPI } from 'features/vessels/offline-vessels.hook'
import { selectAll as selectAllOfflineVessels } from 'features/vessels/offline-vessels.slice'
import SearchPlaceholder, { SearchNoResultsState } from 'features/search/SearchPlaceholders'
import {
  selectAdvancedSearchFields,
  selectQueryParam,
  selectSearchType,
} from 'routes/routes.selectors'
import { fetchVesselSearchThunk } from 'features/search/search.thunk'
import {
  selectSearchOffset,
  selectSearchResults,
  selectSearchTotalResults,
  selectSearching,
} from 'features/search/search.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { SearchType } from 'features/search/search.slice'
import AdvancedSearch from 'features/search/AdvancedSearch'
import SimpleSearch from 'features/search/SimpleSearch'
import styles from './Home.module.css'
import LanguageToggle from './LanguageToggle'

interface LoaderProps {
  invert?: boolean
  timeout?: number
  mini?: boolean
  encounter?: boolean
  carrier?: boolean
}

const Home: React.FC<LoaderProps> = (): React.ReactElement => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const searching = useSelector(selectSearching)
  const query = useSelector(selectQueryParam('q'))
  const searchType = useSelector(selectSearchType)
  const advancedSearch = useSelector(selectAdvancedSearchFields)
  const vessels = useSelector(selectSearchResults)
  const offset = useSelector(selectSearchOffset)
  const totalResults = useSelector(selectSearchTotalResults)
  const offlineVessels = useSelector(selectAllOfflineVessels)
  const { dispatchQueryParams } = useLocationConnect()
  const { dispatchFetchOfflineVessels, dispatchDeleteOfflineVessel } = useOfflineVesselsAPI()
  const promiseRef = useRef<any>()

  useEffect(() => {
    dispatchFetchOfflineVessels()
  }, [dispatchFetchOfflineVessels])

  const fetchResults = useCallback(
    (offset = 0) => {
      if (promiseRef.current) {
        promiseRef.current.abort()
      }
      const advancedSearchParams = searchType === 'advanced' ? advancedSearch : null
      // To ensure the pending action isn't overwritted by the abort above
      // and we miss the loading intermediate state
      setTimeout(() => {
        promiseRef.current = dispatch(
          fetchVesselSearchThunk({
            query,
            offset,
            ...((advancedSearchParams ? { advancedSearchParams } : {}) as any),
          })
        )
      }, 100)
    },
    [dispatch, query, advancedSearch, searchType]
  )

  const searchOptions = useMemo(() => {
    return [
      {
        id: 'basic' as SearchType,
        title: t('search.basic', 'Basic'),
      },
      {
        id: 'advanced' as SearchType,
        title: t('search.advanced', 'Advanced'),
      },
    ]
  }, [t])

  const onSearchOptionChange = (option: ChoiceOption, e: React.MouseEvent<Element, MouseEvent>) => {
    dispatchQueryParams({ searchType: option.id })
  }

  const showHeader = searchType === 'advanced' || !query

  return (
    <div className={styles.homeContainer}>
      {showHeader && (
        <header>
          <Logo className={styles.logo}></Logo>
          <IconButton
            type="default"
            size="default"
            icon="logout"
            onClick={async () => {
              dispatch(logoutUserThunk({ loginRedirect: true }))
            }}
          ></IconButton>
          <Link to={['settings']}>
            <IconButton type="default" size="default" icon="settings"></IconButton>
          </Link>
          <LanguageToggle />
        </header>
      )}
      <div className={styles.search}>
        <div className={cx(styles.title, styles.content)}>
          <h2>{t('search.title', 'Search')}</h2>
          <Choice
            options={searchOptions}
            activeOption={searchType}
            onOptionClick={onSearchOptionChange}
            size="small"
          />
        </div>
        <div className={styles.content}>
          {searchType === 'advanced' ? <AdvancedSearch /> : <SimpleSearch />}
        </div>
        {!query && (
          <div>
            <h2 className={styles.offlineTitle}>{t('common.offlineAccess', 'OFFLINE ACCESS')}</h2>
            {offlineVessels.length > 0 ? (
              <div className={styles.content}>
                {offlineVessels.map((vessel, index) => (
                  <VesselListItem
                    key={index}
                    vessel={vessel}
                    saved={vessel.savedOn}
                    onDeleteClick={() => dispatchDeleteOfflineVessel(vessel.profileId)}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.offlineAccessEmptyState}>
                {t(
                  'common.offlineAccessEmptyState',
                  'The vessels you save for offline access will appear here.'
                )}
              </div>
            )}
          </div>
        )}
        {query && (
          <Fragment>
            <div className={styles.searchResults}>
              {searching && offset === 0 && (
                <SearchPlaceholder>
                  <Spinner className={styles.loader}></Spinner>
                </SearchPlaceholder>
              )}
              {(!searching || offset > 0) && vessels.length > 0 && (
                <div className={styles.content}>
                  {vessels.map((vessel: VesselSearch, index) => (
                    <VesselListItem key={index} vessel={vessel} />
                  ))}
                </div>
              )}
              {totalResults > 0 && !searching && vessels.length < totalResults && (
                <div className={styles.listFooter}>
                  <Button
                    className={styles.loadMoreBtn}
                    onClick={() => fetchResults(offset + RESULTS_PER_PAGE)}
                  >
                    {t('search.loadMore', 'LOAD MORE')}
                  </Button>
                </div>
              )}
              {searching && offset > 0 && (
                <div className={styles.listFooter}>
                  <Spinner className={styles.loader}></Spinner>
                </div>
              )}
              {totalResults > 0 &&
                !searching &&
                vessels.length >= totalResults &&
                vessels.length !== 0 && (
                  <p className={styles.listFooter}>{t('search.noMore', 'NO MORE RESULTS')}</p>
                )}
              {!searching && vessels.length === 0 && <SearchNoResultsState />}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default Home
