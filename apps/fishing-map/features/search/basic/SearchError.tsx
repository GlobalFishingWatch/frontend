import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { selectIsUserExpired } from 'features/user/selectors/user.selectors'
import LocalStorageLoginLink from 'routes/LoginLink'
import { AsyncReducerStatus } from 'utils/async-slice'

import { selectSearchStatus, selectSearchStatusCode } from '../search.slice'
import SearchPlaceholder from '../SearchPlaceholders'

import styles from './SearchBasic.module.css'

function SearchError() {
  const { t } = useTranslation()
  const searchStatus = useSelector(selectSearchStatus)
  const searchStatusCode = useSelector(selectSearchStatusCode)
  const isUserExpired = useSelector(selectIsUserExpired)

  if (searchStatus !== AsyncReducerStatus.Error) {
    return null
  }

  if (searchStatusCode === 401 || isUserExpired) {
    return (
      <SearchPlaceholder>
        <Trans i18nKey="errors.sessionExpired">
          Your session has expired, please
          <LocalStorageLoginLink className={styles.link}>log in</LocalStorageLoginLink> again.
        </Trans>
      </SearchPlaceholder>
    )
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

  return <p className={styles.error}>{t('errors.genericShort', 'Something went wrong')}</p>
}

export default SearchError
