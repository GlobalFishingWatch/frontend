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
import { selectUserIsVesselGroupOwner } from 'features/reports/report-vessel-group/vessel-group-report.selectors'
import VGRTitlePlaceholder from 'features/reports/shared/placeholders/VGRTitlePlaceholder'
import {
  selectReportVesselGroupFlags,
  selectReportVesselGroupTimeRange,
} from 'features/reports/shared/vessels/report-vessels.selectors'
// import { getEventLabel } from 'utils/analytics'
// import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { getVesselGroupVesselsCount } from 'features/vessel-groups/vessel-groups.utils'
import {
  setVesselGroupEditId,
  setVesselGroupModalVessels,
  setVesselGroupsModalOpen,
} from 'features/vessel-groups/vessel-groups-modal.slice'
import LoginButtonWrapper from 'routes/LoginButtonWrapper'
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
  const userIsVesselGroupOwner = useSelector(selectUserIsVesselGroupOwner)
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
            <label className={styles.userLabel}>{t('vesselGroupReport.user')}</label>
          )}
          <h1 className={styles.title} data-test="report-title">
            {vesselGroup.name}
          </h1>
          <h2 className={styles.summary}>
            {parse(
              t('vesselGroup.summary', {
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
            <DataTerminology title={t('vesselGroupReport.vessels')} terminologyKey="vessels" />
          </h2>
        </div>
        <a className={styles.reportLink} href={window.location.href}>
          {t('vesselGroupReport.linkToReport')}
        </a>

        <div className={styles.actions}>
          <LoginButtonWrapper tooltip="">
            <Button
              type="border-secondary"
              size="small"
              className={styles.actionButton}
              onClick={onEditClick}
              disabled={loading}
              tooltip={t('vesselGroup.edit')}
            >
              {userIsVesselGroupOwner ? <p>{t('common.edit')}</p> : <p>{t('common.save')}</p>}
              <Icon icon="edit" type="default" />
            </Button>
          </LoginButtonWrapper>

          {/* <Button
            type="border-secondary"
            size="small"
            className={styles.actionButton}
            onClick={onPrintClick}
            disabled={loading}
          >
            <p>{t('analysis.print ')}</p>
            <Icon icon="print" type="default" />
          </Button> */}
        </div>
      </div>
    </div>
  )
}
