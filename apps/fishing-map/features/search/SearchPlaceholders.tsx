import React from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
// import vesselImage from 'assets/images/vessel@2x.png'
// import vesselNoResultsImage from 'assets/images/vessel-side@2x.png'
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
      {/* <img src={vesselNoResultsImage} alt="vessel" className={styles.noResultsImage} /> */}
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
  return (
    <SearchPlaceholder className={className}>
      {/* <img src={vesselImage} alt="vessel" className={styles.vesselImage} /> */}
      <p>
        {t(
          'search.description',
          'Search by vessel name or identification code (IMO, MMSI, VMS ID, etc…). You can narrow your search pressing the filter icon in the top bar'
        )}
      </p>
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
