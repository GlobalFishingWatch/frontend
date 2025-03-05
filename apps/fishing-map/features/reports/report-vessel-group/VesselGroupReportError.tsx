import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import WorkspaceLoginError from 'features/workspace/WorkspaceLoginError'
import LocalStorageLoginLink from 'routes/LoginLink'
import { AsyncReducerStatus } from 'utils/async-slice'

import { selectVGRError, selectVGRStatus } from './vessel-group-report.slice'

import styles from './VesselGroupReport.module.css'

function VesselGroupReportError({ vesselGroupId }: { vesselGroupId: string }) {
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

  if (reportError?.status === 403) {
    return (
      <WorkspaceLoginError
        title={t('errors.privateVesselGroupReport', 'This is a private vessel group report')}
        emailSubject={`Requesting access for ${vesselGroupId} vessel group report`}
      />
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

  return (
    <div className={styles.emptyState}>
      <p className={styles.error}>
        {reportError?.message || t('errors.genericShort', 'Something went wrong')}
      </p>
    </div>
  )
}

export default VesselGroupReportError
