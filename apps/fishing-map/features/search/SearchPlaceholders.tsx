import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import parse from 'html-react-parser'

import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import { Spinner, Tooltip } from '@globalfishingwatch/ui-components'

import VesselSearchImage from 'assets/images/vessel-search.svg'
import VesselSearchNoSesultsImage from 'assets/images/vessel-search-no-results.svg'
import UserGuideLink from 'features/help/UserGuideLink'
import { selectSearchDatasetsNotGuestAllowedLabels } from 'features/search/search.selectors'
import { selectSearchStatus } from 'features/search/search.slice'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import LocalStorageLoginLink from 'routes/LoginLink'
import { selectQueryParam } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './SearchPlaceholders.module.css'

type SearchPlaceholderProps = {
  className?: string
  children?: React.ReactNode
}

function SearchPlaceholder({ children, className = '' }: SearchPlaceholderProps) {
  return (
    <div className={cx(styles.emptyState, className)}>
      <div>{children}</div>
    </div>
  )
}

export function SearchNoResultsState({ className = '' }: SearchPlaceholderProps) {
  const { t } = useTranslation()
  return (
    <SearchPlaceholder className={className}>
      <div className={styles.container}>
        <VesselSearchNoSesultsImage />
        <p>
          {t(
            'search.noResults',
            "Can't find the vessel you are looking for? Try using MMSI, IMO or Callsign"
          )}
        </p>
      </div>
    </SearchPlaceholder>
  )
}

export function SearchEmptyState({ className = '' }: SearchPlaceholderProps) {
  const { t } = useTranslation()
  const searchStatus = useSelector(selectSearchStatus)
  const guestUser = useSelector(selectIsGuestUser)
  const noGuestDatasets = useSelector(selectSearchDatasetsNotGuestAllowedLabels)
  const activeSearchOption = useSelector(selectQueryParam('searchOption')) || 'basic'
  const isSmallScreen = useSmallScreen()

  return (
    <SearchPlaceholder className={className}>
      <div className={styles.container}>
        <VesselSearchImage className={styles.image} />
        <div className={cx({ [styles.hidden]: searchStatus !== AsyncReducerStatus.Loading })}>
          {t('search.searching', 'Searching more than 100K vessels ...')}
          <Spinner className={styles.spinner} />
        </div>
        <div className={cx({ [styles.hidden]: searchStatus === AsyncReducerStatus.Loading })}>
          {activeSearchOption === 'basic' && (
            <div className={styles.description}>
              {t('search.description', 'Search by vessel name or identification code.')}
              <br />
              {isSmallScreen
                ? t(
                    'search.descriptionSmallScreens',
                    'An advanced search with flters is available on bigger screens'
                  )
                : t(
                    'search.descriptionNarrow',
                    'You can narrow your search by clicking "ADVANCED" in the top menu bar.'
                  )}
            </div>
          )}
          {activeSearchOption === 'advanced' && (
            <p>
              {t(
                'search.descriptionAdvanced',
                'The vessels will appear here once you select your desired filters.'
              )}
            </p>
          )}
          {guestUser && noGuestDatasets?.length > 0 && (
            <p className={cx(styles.description, styles.center)}>
              <Tooltip content={noGuestDatasets.join(', ')}>
                <span className={styles.bold}>
                  {noGuestDatasets.length} {t('common.sources', 'Sources')}
                </span>
              </Tooltip>{' '}
              <Trans i18nKey="search.missingSources">
                won't appear unless you
                <LocalStorageLoginLink className={styles.link}>log in</LocalStorageLoginLink>
              </Trans>
            </p>
          )}
          <p className={styles.highlighted}>
            {parse(t('search.learnMore', 'Learn more about how vessel identity work'))}
          </p>
          <UserGuideLink section="vesselSearch" className={cx(styles.userGuide, styles.center)} />
        </div>
      </div>
    </SearchPlaceholder>
  )
}

export function SearchNotAllowed({ className = '' }: SearchPlaceholderProps) {
  const { t } = useTranslation()
  return (
    <SearchPlaceholder className={className}>
      <p>{t('search.notAllowed', 'Search not allowed')}</p>
    </SearchPlaceholder>
  )
}

export default SearchPlaceholder
