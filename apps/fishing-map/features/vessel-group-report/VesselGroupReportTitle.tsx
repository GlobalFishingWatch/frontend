import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { Button, Icon, IconButton } from '@globalfishingwatch/ui-components'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import ReportTitlePlaceholder from 'features/area-report/placeholders/ReportTitlePlaceholder'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import {
  setNewVesselGroupSearchVessels,
  setVesselGroupEditId,
  setVesselGroupsModalOpen,
} from 'features/vessel-groups/vessel-groups.slice'
import { formatInfoField } from 'utils/info'
import { useLocationConnect } from 'routes/routes.hook'
import { selectHasOtherVesselGroupDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import styles from './VesselGroupReportTitle.module.css'
import { VesselGroupReport } from './vessel-group-report.slice'
import { selectViewOnlyVesselGroup } from './vessel.config.selectors'

type ReportTitleProps = {
  loading?: boolean
  vesselGroup: VesselGroupReport
}

export default function VesselGroupReportTitle({ vesselGroup, loading }: ReportTitleProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const isSmallScreen = useSmallScreen()
  const viewOnlyVesselGroup = useSelector(selectViewOnlyVesselGroup)
  const hasOtherLayers = useSelector(selectHasOtherVesselGroupDataviews)

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

  const toggleViewOnlyVesselGroup = () => {
    if (isSmallScreen) dispatchQueryParams({ sidebarOpen: false })
    dispatchQueryParams({ viewOnlyVesselGroup: !viewOnlyVesselGroup })
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
          {hasOtherLayers && (
            <IconButton
              className="print-hidden"
              type="border"
              icon={viewOnlyVesselGroup ? 'layers-on' : 'layers-off'}
              tooltip={
                viewOnlyVesselGroup
                  ? t('vessel.showOtherLayers', 'Show other layers')
                  : t('vessel.hideOtherLayers', 'Hide other layers')
              }
              tooltipPlacement="bottom"
              size="small"
              onClick={toggleViewOnlyVesselGroup}
            />
          )}
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
