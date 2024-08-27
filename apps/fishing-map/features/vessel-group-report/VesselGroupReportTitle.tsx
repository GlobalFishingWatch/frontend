import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Button, Icon } from '@globalfishingwatch/ui-components'
import { useAppDispatch } from 'features/app/app.hooks'
import ReportTitlePlaceholder from 'features/area-report/placeholders/ReportTitlePlaceholder'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import {
  setNewVesselGroupSearchVessels,
  setVesselGroupEditId,
  setVesselGroupsModalOpen,
} from 'features/vessel-groups/vessel-groups.slice'
import { formatInfoField } from 'utils/info'
import styles from './VesselGroupReportTitle.module.css'
import { VesselGroupReport } from './vessel-group-report.slice'

type ReportTitleProps = {
  loading?: boolean
  vesselGroup: VesselGroupReport
}

export default function VesselGroupReportTitle({ vesselGroup, loading }: ReportTitleProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const onEditClick = useCallback(() => {
    if (vesselGroup?.id || !vesselGroup?.vessels?.length) {
      dispatch(setVesselGroupEditId(vesselGroup.id))
      dispatch(setNewVesselGroupSearchVessels(vesselGroup.vessels))
      dispatch(setVesselGroupsModalOpen(true))
    }
  }, [dispatch, vesselGroup?.id, vesselGroup?.vessels])

  const onPrintClick = () => {
    trackEvent({
      category: TrackCategory.VesselGroupReport,
      action: `Click print/save as pdf`,
    })
    window.print()
  }

  if (loading) {
    return (
      <div className={cx(styles.container, styles.placeholder)}>
        <ReportTitlePlaceholder />
      </div>
    )
  }

  if (!vesselGroup) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={cx(styles.row, styles.border)}>
        <h1 className={styles.title} data-test="report-title">
          {formatInfoField(vesselGroup.name, 'name')}
        </h1>
        <a className={styles.reportLink} href={window.location.href}>
          {t('vesselGroupReport.linkToReport', 'Check the vessel group report here')}
        </a>

        <div className={styles.actions}>
          <Button
            type="border-secondary"
            size="small"
            className={styles.actionButton}
            onClick={onEditClick}
            disabled={loading}
          >
            <p>{t('common.edit ', 'edit')}</p>
            <Icon icon="edit" type="default" />
          </Button>
          <Button
            type="border-secondary"
            size="small"
            className={styles.actionButton}
            onClick={onPrintClick}
            disabled={loading}
          >
            <p>{t('analysis.print ', 'print')}</p>
            <Icon icon="print" type="default" />
          </Button>
        </div>
      </div>
    </div>
  )
}
