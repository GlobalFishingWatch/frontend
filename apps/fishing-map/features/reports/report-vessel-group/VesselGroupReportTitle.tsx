import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import parse from 'html-react-parser'
import { DateTime } from 'luxon'

import { Button, Icon } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import VGRTitlePlaceholder from 'features/reports/shared/placeholders/VGRTitlePlaceholder'
import {
  selectReportVesselGroupFlags,
  selectReportVesselGroupTimeRange,
} from 'features/reports/shared/vessels/report-vessels.selectors'
import { selectUserData } from 'features/user/selectors/user.selectors'
// import { getEventLabel } from 'utils/analytics'
// import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { getVesselGroupVesselsCount } from 'features/vessel-groups/vessel-groups.utils'
import {
  setVesselGroupEditId,
  setVesselGroupModalVessels,
  setVesselGroupsModalOpen,
} from 'features/vessel-groups/vessel-groups-modal.slice'
import { AsyncReducerStatus } from 'utils/async-slice'

import { selectVGRData, selectVGRStatus } from './vessel-group-report.slice'

import styles from './VesselGroupReportTitle.module.css'

export default function VesselGroupReportTitle() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const vesselGroup = useSelector(selectVGRData)!
  const reportStatus = useSelector(selectVGRStatus)
  const timeRange = useSelector(selectReportVesselGroupTimeRange)
  const flags = useSelector(selectReportVesselGroupFlags)
  const userData = useSelector(selectUserData)
  const userIsVesselGroupOwner = userData?.id === vesselGroup?.ownerId
  const loading = reportStatus === AsyncReducerStatus.Loading

  const onEditClick = useCallback(() => {
    if (vesselGroup?.id || !vesselGroup?.vessels?.length) {
      dispatch(setVesselGroupEditId(vesselGroup.id))
      dispatch(setVesselGroupModalVessels(vesselGroup.vessels))
      dispatch(setVesselGroupsModalOpen(true))
    }
  }, [dispatch, vesselGroup?.id, vesselGroup?.vessels])

  // const onPrintClick = () => {
  //   window.print()
  //   trackEvent({
  //     category: TrackCategory.VesselGroupReport,
  //     action: `print_vessel_group_profile`,
  //     label: getEventLabel([
  //       vesselGroup?.name,
  //       vesselGroup?.vessels?.map((v) => v.vesselId).join(','),
  //       timeRange?.start || '',
  //       timeRange?.end || '',
  //     ]),
  //     value: `number of vessels: ${vesselGroup?.vessels?.length}`,
  //   })
  // }

  if (!vesselGroup || !timeRange || loading || !flags) {
    return (
      <div className={styles.container}>
        <VGRTitlePlaceholder />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={cx(styles.row, styles.border)}>
        <div>
          {vesselGroup.ownerType === 'user' && (
            <label className={styles.userLabel}>
              {t('vesselGroupReport.user', 'User Vessel Group')}
            </label>
          )}
          <h1 className={styles.title} data-test="report-title">
            {vesselGroup.name}
          </h1>
          <h2 className={styles.summary}>
            {parse(
              t('vesselGroup.summary', {
                defaultValue:
                  '<strong>{{vessels}} vessels</strong> from <strong>{{flags}} flags</strong> active from <strong>{{start}}</strong> to <strong>{{end}}</strong>',
                vessels: formatI18nNumber(getVesselGroupVesselsCount(vesselGroup)),
                flags: flags?.size,
                start: formatI18nDate(timeRange.start, {
                  format: DateTime.DATE_MED,
                }),
                end: formatI18nDate(timeRange.end, {
                  format: DateTime.DATE_MED,
                }),
              })
            )}
            <DataTerminology
              title={t('vesselGroupReport.vessels', 'Vessel group report vessels')}
              terminologyKey="vessels"
            />
          </h2>
        </div>
        <a className={styles.reportLink} href={window.location.href}>
          {t('vesselGroupReport.linkToReport', 'Check the vessel group report here')}
        </a>

        <div className={styles.actions}>
          {userIsVesselGroupOwner && (
            <Button
              type="border-secondary"
              size="small"
              className={styles.actionButton}
              onClick={onEditClick}
              disabled={loading}
              tooltip={t('vesselGroup.edit ', 'Edit list of vessels')}
            >
              <p>{t('common.edit ', 'edit')}</p>
              <Icon icon="edit" type="default" />
            </Button>
          )}
          {/* <Button
            type="border-secondary"
            size="small"
            className={styles.actionButton}
            onClick={onPrintClick}
            disabled={loading}
          >
            <p>{t('analysis.print ', 'print')}</p>
            <Icon icon="print" type="default" />
          </Button> */}
        </div>
      </div>
    </div>
  )
}
