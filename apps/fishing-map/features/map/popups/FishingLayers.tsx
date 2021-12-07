import React from 'react'
import { event as uaEvent } from 'react-ga'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Spinner, IconButton } from '@globalfishingwatch/ui-components'
import { DatasetTypes, DataviewInstance, EndpointId } from '@globalfishingwatch/api-types'
import { getVesselLabel } from 'utils/info'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import {
  getPresenceVesselDataviewInstance,
  getVesselDataviewInstance,
} from 'features/dataviews/dataviews.utils'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.selectors'
import I18nNumber from 'features/i18n/i18nNumber'
import {
  SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION,
  TooltipEventFeature,
  useClickedEventConnect,
} from 'features/map/map.hooks'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { ExtendedFeatureVessel } from 'features/map/map.slice'
import { getEventLabel } from 'utils/analytics'
import { AsyncReducerStatus } from 'utils/async-slice'
import { isGFWUser } from 'features/user/user.slice'
import { PRESENCE_DATASET_ID, PRESENCE_TRACKS_DATASET_ID } from 'features/datasets/datasets.slice'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import { useMapContext } from '../map-context.hooks'
import styles from './Popup.module.css'

type FishingTooltipRowProps = {
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
}
function FishingTooltipRow({ feature, showFeaturesDetails }: FishingTooltipRowProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { fishingInteractionStatus } = useClickedEventConnect()
  const gfwUser = useSelector(isGFWUser)
  const vessels = useSelector(selectActiveTrackDataviews)
  const { eventManager } = useMapContext()

  const onVesselClick = (
    ev: React.MouseEvent<Element, MouseEvent>,
    vessel: ExtendedFeatureVessel
  ) => {
    eventManager.once('click', (e: any) => e.stopPropagation(), ev.target)
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
    <div className={styles.popupSection}>
      <span className={styles.popupSectionColor} style={{ backgroundColor: feature.color }} />
      <div className={styles.popupSectionContent}>
        {showFeaturesDetails && (
          <h3 className={styles.popupSectionTitle}>
            {feature.title}
            {feature.temporalgrid && feature.temporalgrid.interval === '10days' && (
              <span>
                {' '}
                {t('common.dateRange', {
                  start: formatI18nDate(feature.temporalgrid.visibleStartDate),
                  end: formatI18nDate(feature.temporalgrid.visibleEndDate),
                  defaultValue: 'between {{start}} and {{end}}',
                })}
              </span>
            )}
          </h3>
        )}
        <div className={styles.row}>
          <span className={styles.rowText}>
            <I18nNumber number={feature.value} />{' '}
            {t([`common.${feature.temporalgrid?.unit}` as any, 'common.hour'], 'hours', {
              count: parseInt(feature.value), // neded to select the plural automatically
            })}
          </span>
        </div>
        {fishingInteractionStatus === AsyncReducerStatus.Loading && (
          <div className={styles.loading}>
            <Spinner size="small" />
          </div>
        )}
        {feature.vesselsInfo && (
          <div className={styles.vesselsTable}>
            <div className={styles.vesselsHeader}>
              <label className={styles.vesselsHeaderLabel}>
                {t('common.vessel_other', 'Vessels')}
              </label>
              <label className={styles.vesselsHeaderLabel}>
                {feature.temporalgrid?.unit === 'hours' && t('common.hour_other', 'hours')}
                {feature.temporalgrid?.unit === 'days' && t('common.days_other', 'days')}
              </label>
            </div>
            {feature.vesselsInfo.vessels.map((vessel, i) => {
              const vesselLabel = getVesselLabel(vessel, true)
              const interactionAllowed =
                SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION.includes(
                  feature.temporalgrid?.sublayerInteractionType || ''
                )
              const hasDatasets =
                vessel.infoDataset !== undefined || vessel.trackDataset !== undefined

              const vesselInWorkspace = vessels.find((v) => {
                const vesselDatasetConfig = v.datasetsConfig?.find(
                  (datasetConfig) => datasetConfig.endpoint === EndpointId.Vessel
                )
                const isVesselInEndpointParams = vesselDatasetConfig.params.find(
                  (p) => p.id === 'vesselId' && p.value === vessel.id
                )
                return isVesselInEndpointParams ? v : undefined
              })

              const pinTrackDisabled =
                !interactionAllowed || !hasDatasets || vesselInWorkspace !== undefined

              return (
                <div key={i} className={styles.vesselRow}>
                  <span className={styles.vesselName}>
                    <span>
                      {vesselLabel}
                      {vessel.dataset && vessel.dataset.name && (
                        <span className={styles.vesselRowLegend}> - {vessel.dataset.name}</span>
                      )}
                    </span>
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
                        className={styles.pinButton}
                      />
                    )}
                  </span>
                  <span className={styles.vesselHours}>
                    <I18nNumber number={vessel.hours} />
                  </span>
                </div>
              )
            })}
            {feature.vesselsInfo.overflow && (
              <div className={styles.vesselsMore}>
                + {feature.vesselsInfo.numVessels - feature.vesselsInfo.vessels.length}{' '}
                {t('common.more', 'more')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FishingTooltipRow
