import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Button, IconButton } from '@globalfishingwatch/ui-components'
import { ReportVessel } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { getVesselInWorkspace } from 'features/dataviews/dataviews.utils'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import I18nNumber from 'features/i18n/i18nNumber'
import { useLocationConnect } from 'routes/routes.hook'
import { selectReportVesselsPaginated, selectReportVesselsPagination } from './reports.selectors'
import { ReportActivityUnit } from './Report'
import styles from './ReportVesselsTable.module.css'

type ReportVesselTableProps = {
  activityUnit: ReportActivityUnit
}

export default function ReportVesselsTable({ activityUnit }: ReportVesselTableProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vessels = useSelector(selectReportVesselsPaginated)
  const pagination = useSelector(selectReportVesselsPagination)
  const vesselsInWorkspace = useSelector(selectActiveTrackDataviews)

  const onVesselClick = (ev: React.MouseEvent<Element, MouseEvent>, vessel: ReportVessel) => {
    // const vesselInWorkspace = getVesselInWorkspace(vesselsInWorkspace, vessel.id)
    // if (vesselInWorkspace) {
    //   deleteDataviewInstance(vesselInWorkspace.id)
    //   return
    // }
    // let vesselDataviewInstance: DataviewInstance | undefined
    // if (
    //   gfwUser &&
    //   vessel.dataset?.id.includes(PRESENCE_DATASET_ID) &&
    //   vessel.trackDataset?.id.includes(PRESENCE_TRACKS_DATASET_ID)
    // ) {
    //   vesselDataviewInstance = getPresenceVesselDataviewInstance(vessel, {
    //     trackDatasetId: vessel.trackDataset?.id,
    //     infoDatasetId: vessel.infoDataset?.id,
    //   })
    // } else {
    //   const vesselEventsDatasets = getRelatedDatasetsByType(
    //     vessel.infoDataset || vessel.dataset,
    //     DatasetTypes.Events
    //   )
    //   const eventsDatasetsId =
    //     vesselEventsDatasets && vesselEventsDatasets?.length
    //       ? vesselEventsDatasets.map((d) => d.id)
    //       : []
    //   vesselDataviewInstance = getVesselDataviewInstance(vessel, {
    //     trackDatasetId: vessel.trackDataset?.id,
    //     infoDatasetId: vessel.infoDataset?.id,
    //     ...(eventsDatasetsId.length > 0 && { eventsDatasetsId }),
    //   })
    // }
    // upsertDataviewInstance(vesselDataviewInstance)
    // uaEvent({
    //   category: 'Tracks',
    //   action: 'Click in vessel from grid cell panel',
    //   label: getEventLabel([vessel.dataset.id, vessel.id]),
    // })
  }

  const onPrevPageClick = () => {
    dispatchQueryParams({ reportVesselPage: pagination.page - 1 })
  }
  const onNextPageClick = () => {
    dispatchQueryParams({ reportVesselPage: pagination.page + 1 })
  }

  if (!vessels?.length) return null

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
            {vessels.map((vessel, i) => {
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
                    {`${t(`vessel.gearTypes.${vessel.geartype}` as any, EMPTY_FIELD_PLACEHOLDER)}`}
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
          <span>{`${pagination.offset} - ${
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
            {pagination.total} {t('common.vessel', { count: pagination.total })}
          </span>
          <Button className={styles.footerButton} type="secondary">
            {t('analysis.createVesselGroup', 'Create vessel group')}
          </Button>
          <Button className={styles.footerButton}>
            {t('analysis.downloadVesselsList', 'Download list')}
          </Button>
        </div>
      </div>
    </div>
  )
}
