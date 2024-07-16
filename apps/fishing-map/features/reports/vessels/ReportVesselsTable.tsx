import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Fragment } from 'react'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import I18nNumber from 'features/i18n/i18nNumber'
import { useLocationConnect } from 'routes/routes.hook'
import { getDatasetsReportNotSupported } from 'features/datasets/datasets.utils'
import ReportVesselsTableFooter from 'features/reports/vessels/ReportVesselsTableFooter'
import {
  selectActiveReportDataviews,
  selectReportCategory,
} from 'features/app/selectors/app.reports.selector'
import { ReportCategory } from 'types'
import { selectUserData } from 'features/user/selectors/user.selectors'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { EMPTY_API_VALUES } from 'features/reports/reports.config'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { GLOBAL_VESSELS_DATASET_ID } from 'data/workspaces'
import { selectReportVesselsPaginated } from '../reports.selectors'
import { ReportActivityUnit } from '../Report'
import styles from './ReportVesselsTable.module.css'

type ReportVesselTableProps = {
  activityUnit: ReportActivityUnit
  reportName: string
}

export default function ReportVesselsTable({ activityUnit, reportName }: ReportVesselTableProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vessels = useSelector(selectReportVesselsPaginated)
  const reportCategory = useSelector(selectReportCategory)
  const userData = useSelector(selectUserData)
  const dataviews = useSelector(selectActiveReportDataviews)
  const datasetsDownloadNotSupported = getDatasetsReportNotSupported(
    dataviews,
    userData?.permissions || []
  )

  const onFilterClick = (reportVesselFilter: any) => {
    dispatchQueryParams({ reportVesselFilter, reportVesselPage: 0 })
  }

  const isFishingReport = reportCategory === ReportCategory.Fishing

  return (
    <Fragment>
      <div className={styles.tableContainer} data-test="report-vessels-table">
        {datasetsDownloadNotSupported.length > 0 && (
          <p className={styles.error}>
            {t(
              'analysis.datasetsNotAllowed',
              'Vessels are not included from the following sources:'
            )}{' '}
            {datasetsDownloadNotSupported.map((dataset, index) => (
              <Fragment>
                <DatasetLabel key={dataset} dataset={{ id: dataset }} />
                {index < datasetsDownloadNotSupported.length - 1 && ', '}
              </Fragment>
            ))}
          </p>
        )}
        <div className={styles.vesselsTable}>
          <div className={cx(styles.header, styles.spansFirstTwoColumns)}>
            {t('common.name', 'Name')}
          </div>
          <div className={styles.header}>{t('vessel.mmsi', 'mmsi')}</div>
          <div className={styles.header}>{t('layer.flagState_one', 'Flag state')}</div>
          <div className={styles.header}>
            {isFishingReport
              ? t('vessel.geartype', 'Gear Type')
              : t('vessel.vessel_type', 'Vessel Type')}
          </div>
          <div className={cx(styles.header, styles.right)}>
            {activityUnit === 'hour'
              ? t('common.hour_other', 'hours')
              : t('common.detection_other', 'detections')}
          </div>
          {vessels?.map((vessel, i) => {
            const isLastRow = i === vessels.length - 1
            const flag = t(`flags:${vessel.flag as string}` as any, EMPTY_FIELD_PLACEHOLDER)
            const flagInteractionEnabled = !EMPTY_API_VALUES.includes(vessel.flag)
            const type = isFishingReport ? vessel.geartype : vessel.vesselType
            const typeInteractionEnabled = type !== EMPTY_FIELD_PLACEHOLDER
            const hasDatasets = vessel.infoDataset?.id?.includes(GLOBAL_VESSELS_DATASET_ID)
              ? vessel.infoDataset !== undefined && vessel.trackDataset !== undefined
              : vessel.infoDataset !== undefined || vessel.trackDataset !== undefined
            const pinTrackDisabled = !hasDatasets
            return (
              <Fragment key={vessel.vesselId}>
                <div
                  className={cx({ [styles.border]: !isLastRow }, styles.icon)}
                  data-test={`vessel-${vessel.vesselId}`}
                >
                  <VesselPin
                    vesselToResolve={{
                      id: vessel.id || vessel.vesselId,
                      datasetId: vessel.infoDataset?.id || (vessel.dataset as string),
                    }}
                    disabled={pinTrackDisabled}
                  />
                </div>
                <div className={cx({ [styles.border]: !isLastRow })}>
                  {vessel.sourceColor && (
                    <span
                      className={styles.dot}
                      style={{ backgroundColor: vessel.sourceColor }}
                    ></span>
                  )}
                  <VesselLink
                    className={styles.link}
                    vesselId={vessel.vesselId}
                    datasetId={vessel.infoDataset?.id}
                  >
                    {formatInfoField(vessel.shipName, 'name')}
                  </VesselLink>
                </div>
                <div className={cx({ [styles.border]: !isLastRow })}>
                  <span>{vessel.mmsi || EMPTY_FIELD_PLACEHOLDER}</span>
                </div>
                <div
                  className={cx({
                    [styles.border]: !isLastRow,
                    [styles.pointer]: flagInteractionEnabled,
                  })}
                  title={
                    flagInteractionEnabled
                      ? `${t('analysis.clickToFilterBy', `Click to filter by:`)} ${flag}`
                      : undefined
                  }
                  onClick={flagInteractionEnabled ? () => onFilterClick(`flag:${flag}`) : undefined}
                >
                  <span>{flag}</span>
                </div>
                <div
                  className={cx({
                    [styles.border]: !isLastRow,
                    [styles.pointer]: typeInteractionEnabled,
                  })}
                  title={
                    typeInteractionEnabled
                      ? `${t('analysis.clickToFilterBy', `Click to filter by:`)} ${type}`
                      : undefined
                  }
                  onClick={
                    typeInteractionEnabled
                      ? () =>
                          onFilterClick(
                            `${reportCategory === ReportCategory.Fishing ? 'gear' : 'type'}:${type}`
                          )
                      : undefined
                  }
                >
                  {type}
                </div>
                <div className={cx({ [styles.border]: !isLastRow }, styles.right)}>
                  <I18nNumber number={vessel.value} />
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
      <ReportVesselsTableFooter reportName={reportName} />
    </Fragment>
  )
}
