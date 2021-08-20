import React from 'react'
import { event as uaEvent } from 'react-ga'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getVesselLabel } from 'utils/info'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import {
  getRelatedDatasetByType,
  getRelatedDatasetsByType,
} from 'features/datasets/datasets.selectors'
import I18nNumber from 'features/i18n/i18nNumber'
import {
  SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION,
  TooltipEventFeature,
  useClickedEventConnect,
} from 'features/map/map.hooks'
import { PRESENCE_POC_INTERACTION } from 'features/datasets/datasets.slice'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { ExtendedFeatureVessel } from 'features/map/map.slice'
import { isUserLogged } from 'features/user/user.selectors'
import { getEventLabel } from 'utils/analytics'
import { AsyncReducerStatus } from 'utils/async-slice'
import styles from './Popup.module.css'

type FishingTooltipRowProps = {
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
}
function FishingTooltipRow({ feature, showFeaturesDetails }: FishingTooltipRowProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { fishingInteractionStatus } = useClickedEventConnect()
  const userLogged = useSelector(isUserLogged)

  const onVesselClick = (vessel: ExtendedFeatureVessel) => {
    const vesselRelatedDataset = getRelatedDatasetByType(
      vessel.dataset,
      DatasetTypes.Vessels,
      userLogged
    )

    if (!vesselRelatedDataset) {
      console.warn('Missing info related dataset for', vessel)
    }
    const trackRelatedDataset = getRelatedDatasetByType(
      vessel.dataset,
      DatasetTypes.Tracks,
      userLogged
    )
    if (!trackRelatedDataset) {
      console.warn('Missing track related dataset for', vessel)
    }

    const eventsRelatedDatasets = getRelatedDatasetsByType(vessel.dataset, DatasetTypes.Events)

    const eventsDatasetsId =
      eventsRelatedDatasets && eventsRelatedDatasets?.length
        ? eventsRelatedDatasets.map((d) => d.id)
        : []

    if (vesselRelatedDataset || trackRelatedDataset) {
      const vesselDataviewInstance = getVesselDataviewInstance(vessel, {
        trackDatasetId: trackRelatedDataset?.id,
        infoDatasetId: vesselRelatedDataset?.id,
        ...(eventsDatasetsId.length > 0 && { eventsDatasetsId }),
      })
      upsertDataviewInstance(vesselDataviewInstance)
    }
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
                {t('common.vessel_plural', 'Vessels')}
              </label>
              <label className={styles.vesselsHeaderLabel}>
                {feature.temporalgrid?.unit === 'hours' && t('common.hour_plural', 'hours')}
                {feature.temporalgrid?.unit === 'days' && t('common.days_plural', 'days')}
              </label>
            </div>
            {feature.vesselsInfo.vessels.map((vessel, i) => {
              const vesselLabel = getVesselLabel(vessel, true)
              return (
                <button
                  key={i}
                  disabled={
                    ![
                      ...SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION,
                      PRESENCE_POC_INTERACTION,
                    ].includes(feature.temporalgrid?.sublayerInteractionType || '')
                  }
                  className={styles.vesselRow}
                  onClick={() => onVesselClick(vessel)}
                >
                  <span className={styles.vesselName}>
                    {vesselLabel}
                    {vessel.dataset && vessel.dataset.name && (
                      <span className={styles.vesselRowLegend}> - {vessel.dataset.name}</span>
                    )}
                  </span>
                  <span>
                    <I18nNumber number={vessel.hours} />
                  </span>
                </button>
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
