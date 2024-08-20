import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import { AsyncReducerStatus } from 'utils/async-slice'
import LocalStorageLoginLink from 'routes/LoginLink'
import { selectSearchStatus, selectSearchStatusCode } from '../search.slice'
import SearchPlaceholder from '../SearchPlaceholders'
import styles from './SearchBasic.module.css'

function SearchError() {
  const { t } = useTranslation()
  const searchStatus = useSelector(selectSearchStatus)
  const searchStatusCode = useSelector(selectSearchStatusCode)

  if (searchStatus !== AsyncReducerStatus.Error) {
    return null
  }

  if (searchStatusCode === 404) {
    return (
      <p className={styles.error}>
        {t(
          'search.noResults',
          "Can't find the vessel you are looking for? Try using MMSI, IMO or Callsign"
        )}
      </p>
    )
  }

  if (searchStatusCode === 401) {
    return (
      <SearchPlaceholder>
        <Trans i18nKey="errors.sessionExpired">
          Your session has expired, please
          <LocalStorageLoginLink className={styles.link}>log in</LocalStorageLoginLink> again.
        </Trans>
      </SearchPlaceholder>
    )
  }
  return <p className={styles.error}>{t('errors.genericShort', 'Something went wrong')}</p>
}

export default SearchError
