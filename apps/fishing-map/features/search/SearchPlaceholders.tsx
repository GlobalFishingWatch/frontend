import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@globalfishingwatch/ui-components'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import vesselImage from 'assets/images/vessel@2x.png'
import vesselNoResultsImage from 'assets/images/vessel-side@2x.png'
import { isGuestUser } from 'features/user/user.slice'
import { selectSearchDatasetsNotGuestAllowedLabels } from 'features/search/search.selectors'
import { selectQueryParam } from 'routes/routes.selectors'
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
      <img src={vesselNoResultsImage.src} alt="vessel" className={styles.noResultsImage} />
      <p>
        {t(
          'search.noResults',
          "Can't find the vessel you are looking for? Try using MMSI, IMO or Callsign"
        )}
      </p>
    </SearchPlaceholder>
  )
}

export function SearchEmptyState({ className = '' }: SearchPlaceholderProps) {
  const { t } = useTranslation()
  const guestUser = useSelector(isGuestUser)
  const noGuestDatasets = useSelector(selectSearchDatasetsNotGuestAllowedLabels)
  const activeSearchOption = useSelector(selectQueryParam('searchOption')) || 'basic'
  const isSmallScreen = useSmallScreen()
  return (
    <SearchPlaceholder className={className}>
      <img src={vesselImage.src} alt="vessel" className={styles.vesselImage} />
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
          t( 'search.descriptionAdvanced', 'The vessels will appear here once you select your
          desired filters.' )
        </p>
      )}
      {guestUser && noGuestDatasets?.length > 0 && (
        <p className={styles.description}>
          <Tooltip content={noGuestDatasets.join(', ')}>
            <u>
              {noGuestDatasets.length} {t('common.sources', 'Sources')}
            </u>
          </Tooltip>{' '}
          {t('search.missingSources', 'won’t appear unless you log in')}.
        </p>
      )}
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
