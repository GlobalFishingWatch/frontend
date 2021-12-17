import React from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import { useSelector } from 'react-redux'
import { IconButton, Tooltip } from '@globalfishingwatch/ui-components'
import { DatasetTypes, DataviewInstance } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import {
  getPresenceVesselDataviewInstance,
  getVesselDataviewInstance,
  getVesselInWorkspace,
} from 'features/dataviews/dataviews.utils'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import I18nNumber from 'features/i18n/i18nNumber'
import { ExtendedFeatureVessel, MAX_TOOLTIP_LIST, MAX_VESSELS_LOAD } from 'features/map/map.slice'
import { getEventLabel } from 'utils/analytics'
import { isGFWUser } from 'features/user/user.slice'
import { PRESENCE_DATASET_ID, PRESENCE_TRACKS_DATASET_ID } from 'features/datasets/datasets.slice'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import {
  SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION,
  TooltipEventFeature,
} from '../map.hooks'
import { useMapContext } from '../map-context.hooks'
import styles from './VesselsTable.module.css'

function VesselsTable({
  feature,
  showFullList,
}: {
  feature: TooltipEventFeature
  showFullList?: boolean
}) {
  const { t } = useTranslation()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const gfwUser = useSelector(isGFWUser)
  const vesselsInWorkspace = useSelector(selectActiveTrackDataviews)
  const { eventManager } = useMapContext()
  const interactionAllowed = SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION.includes(
    feature.temporalgrid?.sublayerInteractionType || ''
  )
  const vessels = showFullList
    ? feature.vesselsInfo?.vessels?.slice(0, MAX_VESSELS_LOAD)
    : feature.vesselsInfo?.vessels?.slice(0, MAX_TOOLTIP_LIST)

  const hasPinColumn =
    showFullList ||
    (interactionAllowed &&
      feature.vesselsInfo &&
      feature.vesselsInfo.vessels.some((vessel) => {
        const hasDatasets = vessel.infoDataset !== undefined || vessel.trackDataset !== undefined
        return hasDatasets
      }))

  const onVesselClick = (
    ev: React.MouseEvent<Element, MouseEvent>,
    vessel: ExtendedFeatureVessel
  ) => {
    eventManager.once('click', (e: any) => e.stopPropagation(), ev.target)

    const vesselInWorkspace = getVesselInWorkspace(vesselsInWorkspace, vessel.id)
    if (vesselInWorkspace) {
      deleteDataviewInstance(vesselInWorkspace.id)
      return
    }

    let vesselDataviewInstance: DataviewInstance | undefined
    if (
      gfwUser &&
      vessel.dataset?.id.includes(PRESENCE_DATASET_ID) &&
      vessel.trackDataset?.id.includes(PRESENCE_TRACKS_DATASET_ID)
    ) {
      vesselDataviewInstance = getPresenceVesselDataviewInstance(vessel, {
        trackDatasetId: vessel.trackDataset?.id,
        infoDatasetId: vessel.infoDataset?.id,
      })
    } else {
      const vesselEventsDatasets = getRelatedDatasetsByType(vessel.dataset, DatasetTypes.Events)
      const eventsDatasetsId =
        vesselEventsDatasets && vesselEventsDatasets?.length
          ? vesselEventsDatasets.map((d) => d.id)
          : []

      vesselDataviewInstance = getVesselDataviewInstance(vessel, {
        trackDatasetId: vessel.trackDataset?.id,
        infoDatasetId: vessel.infoDataset?.id,
        ...(eventsDatasetsId.length > 0 && { eventsDatasetsId }),
      })
    }

    upsertDataviewInstance(vesselDataviewInstance)

    uaEvent({
      category: 'Tracks',
      action: 'Click in vessel from grid cell panel',
      label: getEventLabel([vessel.dataset.id, vessel.id]),
    })
  }
  return (
    <table className={cx(styles.vesselsTable, { [styles.fullWidth]: showFullList })}>
      <thead>
        <tr>
          <th colSpan={hasPinColumn ? 2 : 1}>{t('common.vessel_other', 'Vessels')}</th>
          <th>{t('vessel.flag_short', 'iso3')}</th>
          <th>{t('vessel.gearType_short', 'gear')}</th>
          <th>{t('vessel.source_short', 'source')}</th>
          <th className={styles.vesselsTableHeaderRight}>
            {feature.temporalgrid?.unit === 'hours' && t('common.hour_other', 'hours')}
            {feature.temporalgrid?.unit === 'days' && t('common.days_other', 'days')}
          </th>
        </tr>
      </thead>
      <tbody>
        {vessels.map((vessel, i) => {
          const vesselName = formatInfoField(vessel.shipname, 'name')
          const vesselGearType = `${t(
            `vessel.gearTypes.${vessel.geartype}` as any,
            EMPTY_FIELD_PLACEHOLDER
          )}`

          const hasDatasets = vessel.infoDataset !== undefined || vessel.trackDataset !== undefined

          const vesselInWorkspace = getVesselInWorkspace(vessels, vessel.id)

          const pinTrackDisabled = !interactionAllowed || !hasDatasets
          return (
            <tr key={i}>
              <td className={styles.icon}>
                {!pinTrackDisabled && (
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
                )}
              </td>
              <td>{vesselName}</td>
              <td>
                <Tooltip content={t(`flags:${vessel.flag as string}` as any)}>
                  <span>{vessel.flag}</span>
                </Tooltip>
              </td>
              <td>{vesselGearType}</td>
              <td>{vessel.dataset && vessel.dataset.name}</td>
              <td className={styles.vesselsTableHour}>
                <I18nNumber number={vessel.hours} />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default VesselsTable
