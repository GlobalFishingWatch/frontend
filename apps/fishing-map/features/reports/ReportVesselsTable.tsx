import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { CSVLink } from 'react-csv'
import { Button, IconButton } from '@globalfishingwatch/ui-components'
import { DatasetTypes, DataviewInstance } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { getVesselDataviewInstance, getVesselInWorkspace } from 'features/dataviews/dataviews.utils'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import I18nNumber from 'features/i18n/i18nNumber'
import { useLocationConnect } from 'routes/routes.hook'
import { selectUrlTimeRange } from 'routes/routes.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import {
  ReportVesselWithDatasets,
  selectReportVesselsListWithAllInfo,
  selectReportVesselsPaginated,
  selectReportVesselsPagination,
} from './reports.selectors'
import { ReportActivityUnit } from './Report'
import styles from './ReportVesselsTable.module.css'

type ReportVesselTableProps = {
  activityUnit: ReportActivityUnit
  reportName: string
}

export default function ReportVesselsTable({ activityUnit, reportName }: ReportVesselTableProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const allVessels = useSelector(selectReportVesselsListWithAllInfo)
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const vessels = useSelector(selectReportVesselsPaginated)
  const pagination = useSelector(selectReportVesselsPagination)
  const vesselsInWorkspace = useSelector(selectActiveTrackDataviews)
  const { start, end } = useSelector(selectUrlTimeRange)

  const onVesselClick = (
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

  const onPrevPageClick = () => {
    dispatchQueryParams({ reportVesselPage: pagination.page - 1 })
  }
  const onNextPageClick = () => {
    dispatchQueryParams({ reportVesselPage: pagination.page + 1 })
  }

  const isLastPaginationPage = pagination.offset + pagination.results >= pagination.total
  return (
    <div>
      <div className={styles.tableContainer}>
        <table className={cx(styles.vesselsTable)}>
          <thead>
            <tr>
              <th colSpan={2}>{t('common.name', 'Name')}</th>
              <th>{t('vessel.mmsi', 'mmsi')}</th>
              <th>{t('layer.flagState_one', 'Flag state')}</th>
              <th>{t('vessel.gearType_short', 'gear')}</th>
              {/* Disabled for detections to allocate some space for timestamps interaction */}
              <th className={styles.right}>
                {activityUnit === 'hours'
                  ? t('common.hour_other', 'hours')
                  : t('common.detection_other', 'detections')}
              </th>
            </tr>
          </thead>
          <tbody>
            {vessels?.map((vessel, i) => {
              const hasDatasets = true
              // TODO get datasets from the vessel
              // const hasDatasets = vessel.infoDataset !== undefined || vessel.trackDataset !== undefined

              const vesselInWorkspace = getVesselInWorkspace(vesselsInWorkspace, vessel.vesselId)

              const pinTrackDisabled = !hasDatasets
              return (
                <tr key={i}>
                  {!pinTrackDisabled && (
                    <td className={styles.icon}>
                      <IconButton
                        icon={vesselInWorkspace ? 'pin-filled' : 'pin'}
                        style={{
                          color: vesselInWorkspace ? vesselInWorkspace.config.color : '',
                        }}
                        tooltip={
                          vesselInWorkspace
                            ? t(
                                'search.vesselAlreadyInWorkspace',
                                'This vessel is already in your workspace'
                              )
                            : t('search.seeVessel', 'See vessel')
                        }
                        onClick={(e) => onVesselClick(e, vessel)}
                        size="small"
                      />
                    </td>
                  )}
                  <td colSpan={pinTrackDisabled ? 2 : 1}>
                    {formatInfoField(vessel.shipName, 'name')}
                  </td>
                  <td colSpan={1} className={styles.columnSpace}>
                    <span>{vessel.mmsi || EMPTY_FIELD_PLACEHOLDER}</span>
                  </td>
                  <td colSpan={1} className={styles.columnSpace}>
                    <span>
                      {t(`flags:${vessel.flag as string}` as any, EMPTY_FIELD_PLACEHOLDER)}
                    </span>
                  </td>
                  <td colSpan={1} className={styles.columnSpace}>
                    {t(`vessel.gearTypes.${vessel.geartype}` as any, EMPTY_FIELD_PLACEHOLDER)}
                  </td>
                  <td colSpan={1} className={cx(styles.columnSpace, styles.right)}>
                    <I18nNumber number={vessel[activityUnit]} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.footer}>
        <div>
          <IconButton
            icon="arrow-left"
            disabled={pagination.page === 0}
            className={cx({ [styles.disabled]: pagination.page === 0 })}
            onClick={onPrevPageClick}
            size="medium"
          />
          <span>{`${pagination.offset + 1} - ${
            isLastPaginationPage ? pagination.total : pagination.offset + pagination.results
          }`}</span>
          <IconButton
            icon="arrow-right"
            onClick={onNextPageClick}
            disabled={isLastPaginationPage}
            className={cx({ [styles.disabled]: isLastPaginationPage })}
            size="medium"
          />
        </div>
        <div>
          <span>
            <I18nNumber number={pagination.total} />{' '}
            {t('common.vessel', { count: pagination.total })}
          </span>
          <VesselGroupAddButton vessels={vessels} showCount={false} />
          <CSVLink filename={`${reportName}-${start}-${end}.csv`} data={allVessels}>
            <Button className={styles.footerButton}>
              {t('analysis.downloadVesselsList', 'Download list')}
            </Button>
          </CSVLink>
        </div>
      </div>
    </div>
  )
}
