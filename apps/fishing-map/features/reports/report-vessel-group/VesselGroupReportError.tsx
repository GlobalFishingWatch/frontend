import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import LoginLink from 'features/user/LoginLink'
import WorkspaceLoginError from 'features/workspace/WorkspaceLoginError'
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
        <p className={styles.error}>{t((t) => t.vesselGroupReport.notFound)}</p>
      </div>
    )
  }

  if (reportError?.status === 403) {
    return (
      <WorkspaceLoginError
        title={t((t) => t.errors.privateVesselGroupReport)}
        emailSubject={`Requesting access for ${vesselGroupId} vessel group report`}
      />
    )
  }

  if (reportError?.status === 401) {
    return (
      <div className={styles.emptyState}>
        <Trans i18nKey={(t) => t.errors.sessionExpired}>
          Your session has expired, please
          <LoginLink className={styles.loginLink} loginSource="vessel-group-report">
            log in
          </LoginLink>{' '}
          again.
        </Trans>
      </div>
    )
  }

  return (
    <div className={styles.emptyState}>
      <p className={styles.error}>{reportError?.message || t((t) => t.errors.genericShort)}</p>
    </div>
  )
}

export default VesselGroupReportError
