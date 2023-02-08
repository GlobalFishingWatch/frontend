import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { IconButton } from '@globalfishingwatch/ui-components'
import { ReportVessel } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { getVesselInWorkspace } from 'features/dataviews/dataviews.utils'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import I18nNumber from 'features/i18n/i18nNumber'
import { selectReportVesselsList } from './reports.selectors'
import { ReportActivityUnit } from './Report'
import styles from './ReportVesselsTable.module.css'

type ReportVesselTableProps = {
  activityUnit: ReportActivityUnit
}

export default function ReportVesselsTable({ activityUnit }: ReportVesselTableProps) {
  const { t } = useTranslation()
  const vessels = useSelector(selectReportVesselsList)
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

  if (!vessels?.length) return null
  return (
    <table className={cx(styles.vesselsTable)}>
      <thead>
        <tr>
          <th colSpan={2}>{t('common.name', 'Name')}</th>
          <th>{t('vessel.mmsi', 'mmsi')}</th>
          <th>{t('layer.flagState_one', 'Flag state')}</th>
          <th>{t('vessel.gearType_short', 'gear')}</th>
          {/* Disabled for detections to allocate some space for timestamps interaction */}
          <th>
            {activityUnit === 'hours'
              ? t('common.hour_other', 'hours')
              : t('common.detection_other', 'detections')}
          </th>
        </tr>
      </thead>
      <tbody>
        {vessels.map((vessel, i) => {
          const vesselName = formatInfoField(vessel.shipName, 'name')

          const vesselGearType = `${t(
            `vessel.gearTypes.${vessel.geartype}` as any,
            vessel.geartype ?? EMPTY_FIELD_PLACEHOLDER
          )}`

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
              <td colSpan={pinTrackDisabled ? 2 : 1}>{vesselName}</td>
              <td className={styles.columnSpace}>
                <span>{vessel.mmsi}</span>
              </td>
              <td className={styles.columnSpace}>
                <span>{t(`flags:${vessel.flag as string}` as any, EMPTY_FIELD_PLACEHOLDER)}</span>
              </td>
              <td className={styles.columnSpace}>{vesselGearType}</td>
              <td className={cx(styles.columnSpace, styles.vesselsTableHour)}>
                <I18nNumber number={vessel[activityUnit]} />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
