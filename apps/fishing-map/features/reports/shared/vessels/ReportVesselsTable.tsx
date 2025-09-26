import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { IconButton, Spinner } from '@globalfishingwatch/ui-components'

import { GLOBAL_VESSELS_DATASET_ID } from 'data/workspaces'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { getDatasetsReportNotSupported } from 'features/datasets/datasets.utils'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import I18nNumber from 'features/i18n/i18nNumber'
import { selectVGRCoverageInsight } from 'features/reports/report-vessel-group/vessel-group-report.selectors'
import { EMPTY_API_VALUES } from 'features/reports/reports.config'
import {
  selectReportVesselsOrderDirection,
  selectReportVesselsOrderProperty,
} from 'features/reports/reports.config.selectors'
import { selectReportCategory } from 'features/reports/reports.selectors'
import type {
  ReportVesselOrderDirection,
  ReportVesselOrderProperty,
} from 'features/reports/reports.types'
import { selectReportIsPinningVessels } from 'features/reports/tabs/activity/reports-activity.slice'
import type { ReportActivityUnit } from 'features/reports/tabs/activity/reports-activity.types'
import { selectUserData } from 'features/user/selectors/user.selectors'
import VesselLink from 'features/vessel/VesselLink'
import type { VesselPinClickProps } from 'features/vessel/VesselPin'
import VesselPin from 'features/vessel/VesselPin'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { selectIsAnyAreaReportLocation } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

import type { ReportTableVessel, ReportVesselValues } from './report-vessels.types'
import ReportVesselsTableFooter from './ReportVesselsTableFooter'

import styles from './ReportVesselsTable.module.css'

type ReportVesselTableProps = {
  vessels: ReportTableVessel[]
  activityUnit?: ReportActivityUnit
  allowSorting?: boolean
}

export default function ReportVesselsTable({
  vessels,
  activityUnit,
  allowSorting = true,
}: ReportVesselTableProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const isPinningVessels = useSelector(selectReportIsPinningVessels)
  const userData = useSelector(selectUserData)
  const dataviews = useSelector(selectActiveReportDataviews)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const orderProperty = useSelector(selectReportVesselsOrderProperty)
  const isAnyAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const reportCategory = useSelector(selectReportCategory)
  const orderDirection = useSelector(selectReportVesselsOrderDirection)
  const vGRCoverageInsight = useSelector(selectVGRCoverageInsight)
  const datasetsDownloadNotSupported = getDatasetsReportNotSupported(
    dataviews,
    userData?.permissions || []
  )

  const redirectToVesselProfile = useCallback((shipName: string) => {
    trackEvent({
      category: TrackCategory.GlobalReports,
      action: `redirect to vessel profile`,
      label: shipName,
    })
  }, [])

  const onFilterClick = (reportVesselFilter: any) => {
    dispatchQueryParams({ reportVesselFilter, reportVesselPage: 0 })
  }

  const handleSortClick = (
    property: ReportVesselOrderProperty,
    direction: ReportVesselOrderDirection
  ) => {
    dispatchQueryParams({
      reportVesselOrderProperty: property,
      reportVesselOrderDirection: direction,
    })
  }

  const onPinClick = ({ vesselId }: VesselPinClickProps) => {
    trackEvent({
      category: TrackCategory.VesselGroupReport,
      action: `vessel_report_pin_vessel`,
      label: vesselId,
    })
  }

  return (
    <Fragment>
      <div className={styles.tableContainer} data-test="report-vessels-table">
        {isAnyAreaReportLocation &&
          reportCategory === 'activity' &&
          datasetsDownloadNotSupported.length > 0 && (
            <p className={styles.error}>
              {t('analysis.datasetsNotAllowed')}{' '}
              {datasetsDownloadNotSupported.map((dataset, index) => (
                <Fragment key={dataset}>
                  <DatasetLabel key={dataset} dataset={{ id: dataset }} />
                  {index < datasetsDownloadNotSupported.length - 1 && ', '}
                </Fragment>
              ))}
            </p>
          )}
        <div className={cx(styles.vesselsTable, { [styles.vesselsTableWithValue]: activityUnit })}>
          <div className={cx(styles.header, styles.spansFirstTwoColumns)}>
            {t('common.name')}
            {allowSorting && (
              <IconButton
                size="tiny"
                icon={orderDirection === 'asc' ? 'sort-asc' : 'sort-desc'}
                onClick={() =>
                  handleSortClick('shipname', orderDirection === 'asc' ? 'desc' : 'asc')
                }
                className={cx(styles.sortIcon, { [styles.active]: orderProperty === 'shipname' })}
              />
            )}
          </div>
          <div className={styles.header}>{t('vessel.mmsi')}</div>
          <div className={styles.header}>
            {t('layer.flagState_one')}
            {allowSorting && (
              <IconButton
                size="tiny"
                icon={orderDirection === 'asc' ? 'sort-asc' : 'sort-desc'}
                onClick={() => handleSortClick('flag', orderDirection === 'asc' ? 'desc' : 'asc')}
                className={cx(styles.sortIcon, { [styles.active]: orderProperty === 'flag' })}
              />
            )}
          </div>
          <div className={styles.header}>
            {t('vessel.type')}
            {allowSorting && (
              <IconButton
                size="tiny"
                icon={orderDirection === 'asc' ? 'sort-asc' : 'sort-desc'}
                onClick={() =>
                  handleSortClick('shiptype', orderDirection === 'asc' ? 'desc' : 'asc')
                }
                className={cx(styles.sortIcon, { [styles.active]: orderProperty === 'shiptype' })}
              />
            )}
          </div>
          {activityUnit && (
            <div className={cx(styles.header, styles.right)}>
              {activityUnit === 'hour'
                ? t('common.hour_other')
                : activityUnit === 'detection'
                  ? t('common.detection_other')
                  : activityUnit === 'coverage'
                    ? t('vessel.insights.coverage')
                    : t('common.event_other')}
            </div>
          )}
          {vessels?.map((vessel, i) => {
            const {
              id,
              shipName,
              flag,
              flagTranslated,
              flagTranslatedClean,
              geartype,
              vesselType,
              ssvid,
            } = vessel
            const isLastRow = i === vessels.length - 1
            const hasGearType = geartype !== '' && geartype !== EMPTY_FIELD_PLACEHOLDER
            const type = hasGearType ? geartype : vesselType
            const flagInteractionEnabled = !EMPTY_API_VALUES.includes(flagTranslated)
            const workspaceReady = workspaceStatus === AsyncReducerStatus.Finished
            const value = vessel.value || (vessel as any)[activityUnit as any]
            const values = vessel.values
              ? vessel.values
              : value
                ? ([{ value }] as ReportVesselValues)
                : []
            const hasDatasets = vessel.datasetId?.includes(GLOBAL_VESSELS_DATASET_ID)
              ? vessel.datasetId !== undefined && vessel.trackDatasetId !== undefined
              : vessel.datasetId !== undefined || vessel.trackDatasetId !== undefined
            const pinTrackDisabled = !workspaceReady || !hasDatasets || isPinningVessels
            const showVesselColor = values.length > 0 && !values.some((v) => v.color)
            return (
              <Fragment key={id}>
                <div
                  className={cx({ [styles.border]: !isLastRow }, styles.icon)}
                  data-test={`vessel-${vessel.id}`}
                >
                  <VesselPin
                    vesselToResolve={{
                      id: vessel.id || vessel.id,
                      datasetId: vessel.datasetId,
                    }}
                    disabled={pinTrackDisabled}
                    onClick={onPinClick}
                  />
                </div>
                <div className={cx({ [styles.border]: !isLastRow })}>
                  {workspaceReady ? (
                    <Fragment>
                      {showVesselColor && vessel.color && (
                        <span className={styles.dot} style={{ backgroundColor: vessel.color }} />
                      )}
                      <VesselLink
                        className={styles.link}
                        vesselId={id}
                        datasetId={vessel.datasetId}
                        query={{ vesselIdentitySource: VesselIdentitySourceEnum.SelfReported }}
                        onClick={() => redirectToVesselProfile(shipName)}
                      >
                        {shipName}
                      </VesselLink>
                    </Fragment>
                  ) : (
                    shipName
                  )}
                </div>
                <div className={cx({ [styles.border]: !isLastRow })}>
                  <span>{ssvid || EMPTY_FIELD_PLACEHOLDER}</span>
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  className={cx({
                    [styles.border]: !isLastRow,
                    [styles.pointer]: flagInteractionEnabled,
                  })}
                  title={
                    flagInteractionEnabled ? `${t('analysis.clickToFilterBy')} ${flag}` : undefined
                  }
                  onClick={
                    flagInteractionEnabled
                      ? () => onFilterClick(`flag:${flagTranslatedClean}`)
                      : undefined
                  }
                >
                  <span>{flagTranslated}</span>
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  className={cx(styles.pointer, {
                    [styles.border]: !isLastRow,
                  })}
                  title={`${t('analysis.clickToFilterBy')} ${type}`}
                  onClick={() => onFilterClick(`${'type'}:${type}`)}
                >
                  {type}
                </div>
                {activityUnit && (
                  <div className={cx({ [styles.border]: !isLastRow }, styles.right)}>
                    {values.length &&
                      values.map((v) => {
                        if (activityUnit === 'coverage' && vGRCoverageInsight?.isLoading) {
                          return <Spinner key={id} size="tiny" />
                        }
                        return (
                          activityUnit === 'coverage' ? v.value !== -1 : v.value !== undefined
                        ) ? (
                          <Fragment key={v.value}>
                            {v.color && dataviews?.length > 1 && (
                              <span
                                className={styles.dot}
                                style={{ backgroundColor: v.color }}
                              ></span>
                            )}
                            <span className={styles.value}>
                              <I18nNumber number={v.value} />
                              {activityUnit === 'coverage' ? '%' : ''}
                            </span>
                          </Fragment>
                        ) : (
                          EMPTY_FIELD_PLACEHOLDER
                        )
                      })}
                  </div>
                )}
              </Fragment>
            )
          })}
        </div>
      </div>
      <ReportVesselsTableFooter activityUnit={activityUnit} />
    </Fragment>
  )
}
