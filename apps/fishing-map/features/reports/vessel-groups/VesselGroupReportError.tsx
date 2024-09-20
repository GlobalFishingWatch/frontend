import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import { AsyncReducerStatus } from 'utils/async-slice'
import LocalStorageLoginLink from 'routes/LoginLink'
import styles from './VesselGroupReport.module.css'
import { selectVGRError, selectVGRStatus } from './vessel-group-report.slice'

function VesselGroupReportError() {
  const { t } = useTranslation()
  const reportStatus = useSelector(selectVGRStatus)
  const reportError = useSelector(selectVGRError)

  if (reportStatus !== AsyncReducerStatus.Error) {
    return null
  }

  if (reportError?.status === 404) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.error}>{t('vesselGroupReport.notFound', 'Vessel group not found')}</p>
      </div>
    )
  }

  if (reportError?.status === 401) {
    return (
      <div className={styles.emptyState}>
        <Trans i18nKey="errors.sessionExpired">
          Your session has expired, please
          <LocalStorageLoginLink className={styles.loginLink}>log in</LocalStorageLoginLink> again.
        </Trans>
      </div>
    )
  }

  // if (reportError?.status === 403) {
  //   TODO when no permission to see the vessel group
  // }

  return (
    <div className={styles.emptyState}>
      <p className={styles.error}>
        {reportError?.message || t('errors.genericShort', 'Something went wrong')}
      </p>
    </div>
  )
}

export default VesselGroupReportError
