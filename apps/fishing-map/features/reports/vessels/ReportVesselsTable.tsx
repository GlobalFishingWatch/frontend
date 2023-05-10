import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Fragment } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import { DatasetTypes, DataviewInstance } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { getVesselDataviewInstance, getVesselInWorkspace } from 'features/dataviews/dataviews.utils'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import I18nNumber from 'features/i18n/i18nNumber'
import { useLocationConnect } from 'routes/routes.hook'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import {
  getDatasetsReportNotSupported,
  getRelatedDatasetsByType,
} from 'features/datasets/datasets.utils'
import { getVesselGearOrType } from 'features/reports/reports.utils'
import ReportVesselsTableFooter from 'features/reports/vessels/ReportVesselsTableFooter'
import { selectActiveReportDataviews, selectReportCategory } from 'features/app/app.selectors'
import { ReportCategory } from 'types'
import { selectUserData } from 'features/user/user.slice'
import DatasetLabel from 'features/datasets/DatasetLabel'
import {
  EMPTY_API_VALUES,
  ReportVesselWithDatasets,
  selectReportVesselsPaginated,
} from '../reports.selectors'
import { ReportActivityUnit } from '../Report'
import styles from './ReportVesselsTable.module.css'

type ReportVesselTableProps = {
  activityUnit: ReportActivityUnit
  reportName: string
}

export default function ReportVesselsTable({ activityUnit, reportName }: ReportVesselTableProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const vessels = useSelector(selectReportVesselsPaginated)
  const vesselsInWorkspace = useSelector(selectActiveTrackDataviews)
  const reportCategory = useSelector(selectReportCategory)
  const userData = useSelector(selectUserData)
  const dataviews = useSelector(selectActiveReportDataviews)
  const datasetsDownloadNotSupported = getDatasetsReportNotSupported(
    dataviews,
    userData?.permissions || []
  )

  const onVesselClick = async (
    ev: React.MouseEvent<Element, MouseEvent>,
    vessel: ReportVesselWithDatasets
  ) => {
    const vesselInWorkspace = getVesselInWorkspace(vesselsInWorkspace, vessel.vesselId)
    if (vesselInWorkspace) {
      deleteDataviewInstance(vesselInWorkspace.id)
      return
    }
    const vesselEventsDatasets = getRelatedDatasetsByType(vessel.infoDataset, DatasetTypes.Events)
    const eventsDatasetsId =
      vesselEventsDatasets && vesselEventsDatasets?.length
        ? vesselEventsDatasets.map((d) => d.id)
        : []
    const vesselDataviewInstance: DataviewInstance = getVesselDataviewInstance(
      { id: vessel.vesselId },
      {
        trackDatasetId: vessel.trackDataset?.id,
        infoDatasetId: vessel.infoDataset?.id,
        ...(eventsDatasetsId.length > 0 && { eventsDatasetsId }),
      }
    )
    upsertDataviewInstance(vesselDataviewInstance)
  }

  const onFilterClick = (reportVesselFilter) => {
    dispatchQueryParams({ reportVesselFilter, reportVesselPage: 0 })
  }

  return (
    <Fragment>
      <div className={styles.tableContainer}>
        {datasetsDownloadNotSupported.length > 0 && (
          <p className={styles.error}>
            {t(
              'analysis.datasetsNotAllowed',
              "You don't have permissions to see vessel from the following datasets:"
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
            {reportCategory === ReportCategory.Fishing
              ? t('vessel.geartype', 'Gear Type')
              : t('vessel.vessel_type', 'Vessel Type')}
          </div>
          <div className={cx(styles.header, styles.right)}>
            {activityUnit === 'hour'
              ? t('common.hour_other', 'hours')
              : t('common.detection_other', 'detections')}
          </div>
          {vessels?.map((vessel, i) => {
            const hasDatasets = true
            // TODO get datasets from the vessel
            // const hasDatasets = vessel.infoDataset !== undefined || vessel.trackDataset !== undefined
            const vesselInWorkspace = getVesselInWorkspace(vesselsInWorkspace, vessel.vesselId)
            const pinTrackDisabled = !hasDatasets
            const isLastRow = i === vessels.length - 1
            const flag = t(`flags:${vessel.flag as string}` as any, EMPTY_FIELD_PLACEHOLDER)
            const flagInteractionEnabled = !EMPTY_API_VALUES.includes(vessel.flag)
            const type = getVesselGearOrType(vessel)
            const typeInteractionEnabled = type !== EMPTY_FIELD_PLACEHOLDER
            return (
              <Fragment key={vessel.vesselId}>
                {!pinTrackDisabled && (
                  <div className={cx({ [styles.border]: !isLastRow }, styles.icon)}>
                    <IconButton
                      icon={vesselInWorkspace ? 'pin-filled' : 'pin'}
                      style={{
                        color: vesselInWorkspace ? vesselInWorkspace.config.color : '',
                      }}
                      tooltip={
                        vesselInWorkspace
                          ? t('search.removeVessel', 'Remove vessel')
                          : t('search.seeVessel', 'See vessel')
                      }
                      onClick={(e) => onVesselClick(e, vessel)}
                      size="small"
                    />
                  </div>
                )}
                <div className={cx({ [styles.border]: !isLastRow })}>
                  {vessel.sourceColor && (
                    <span
                      className={styles.dot}
                      style={{ backgroundColor: vessel.sourceColor }}
                    ></span>
                  )}
                  {formatInfoField(vessel.shipName, 'name')}
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
                  <I18nNumber number={vessel.hours} />
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
