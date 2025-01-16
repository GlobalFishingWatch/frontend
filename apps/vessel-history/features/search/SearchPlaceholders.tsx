import { Trans,useTranslation } from 'react-i18next'
import cx from 'classnames'

import vesselImage from 'assets/images/vessel@2x.png'
import vesselNoResultsImage from 'assets/images/vessel-side@2x.png'

import type { HttpError } from './search.slice'

import styles from './SearchPlaceholders.module.css'

type SearchPlaceholderProps = {
  className?: string
  children?: React.ReactNode
}

type SearchErrorProps = {
  error: HttpError
  className?: string
}

type SearchNoResultsStateProps = SearchPlaceholderProps & {
  contactUsLink?: string
  onContactUsClick?: () => void
}

function SearchPlaceholder({ children, className = '' }: SearchPlaceholderProps) {
  return (
    <div className={cx(styles.emptyState, className)}>
      <div>{children}</div>
    </div>
  )
}

export function SearchNoResultsState({
  className = '',
  contactUsLink = '',
  onContactUsClick = () => { },
}: SearchNoResultsStateProps) {
  return (
    <SearchPlaceholder className={className}>
      <img src={vesselNoResultsImage.src} alt="vessel" className={styles.noResultsImage} />
      <p>
        <Trans i18nKey="search.noResults">
          Can't find the vessel you are looking for? Try using MMSI, IMO or Call Sign or{' '}
          <a
            href={contactUsLink}
            rel="noopener noreferrer"
            target="_blank"
            onClick={onContactUsClick}
          >
            contact us
          </a>{' '}
          if you still can’t find it.
        </Trans>
      </p>
    </SearchPlaceholder>
  )
}

export function SearchNoResultsFromTmtState({
  className = '',
}: SearchNoResultsStateProps) {
  return (
    <SearchPlaceholder className={className}>
      <img src={vesselNoResultsImage.src} alt="vessel" className={styles.noResultsImage} />
      <p>
        <Trans i18nKey="search.noTmtResults">
          A vessel with these criteria could not be found, due to a timeout in the search function. Please try again.
        </Trans>
      </p>
    </SearchPlaceholder>
  )
}

export function SearchEmptyState({ className = '' }: SearchPlaceholderProps) {
  const { t } = useTranslation()
  return (
    <SearchPlaceholder className={className}>
      <img src={vesselImage.src} alt="vessel" className={styles.vesselImage} />
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

export function SearchErrorState({ className = '', error }: SearchErrorProps) {
  const { t } = useTranslation()
  return (
    <SearchPlaceholder className={className}>
      <p>{error.message}</p>
    </SearchPlaceholder>
  )
}

export default SearchPlaceholder
