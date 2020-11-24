import React from 'react'
import { useTranslation } from 'react-i18next'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { ExtendedFeatureVessel } from '@globalfishingwatch/react-hooks'
import { formatInfoField, formatNumber } from 'utils/info'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { getRelatedDatasetByType } from 'features/workspace/workspace.selectors'
import I18nNumber from 'features/i18n/i18nNumber'
import { TooltipEventFeature, useClickedEventConnect } from 'features/map/map.hooks'
import { AsyncReducerStatus } from 'types'
import { TRACKS_DATASET_TYPE, VESSELS_DATASET_TYPE } from 'data/datasets'
import styles from './Popup.module.css'

// Translations by feature.unit static keys
// t('common.hour')

type HeatmapTooltipRowProps = {
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
}
function HeatmapTooltipRow({ feature, showFeaturesDetails }: HeatmapTooltipRowProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { clickedEventStatus } = useClickedEventConnect()

  const onVesselClick = (vessel: ExtendedFeatureVessel) => {
    const infoDataset = getRelatedDatasetByType(vessel.dataset, VESSELS_DATASET_TYPE)
    const trackDataset = getRelatedDatasetByType(vessel.dataset, TRACKS_DATASET_TYPE)
    if (infoDataset && trackDataset) {
      const vesselDataviewInstance = getVesselDataviewInstance(vessel, {
        trackDatasetId: trackDataset.id,
        infoDatasetId: infoDataset.id,
      })
      upsertDataviewInstance(vesselDataviewInstance)
    }
  }

  return (
    <div className={styles.popupSection}>
      <span className={styles.popupSectionColor} style={{ backgroundColor: feature.color }} />
      <div className={styles.popupSectionContent}>
        {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
        <div className={styles.row}>
          <span className={styles.rowText}>
            <I18nNumber number={feature.value} />{' '}
            {t([`common.${feature.unit}`, 'common.hour'], 'hours', {
              count: parseInt(feature.value), // neded to select the plural automatically
            })}
          </span>
        </div>
        {clickedEventStatus === AsyncReducerStatus.Loading && (
          <div className={styles.loading}>
            <Spinner size="small" />
          </div>
        )}
        {feature.vesselsInfo && (
          <div className={styles.vesselsTable}>
            <div className={styles.vesselsHeader}>
              <label className={styles.vesselsHeaderLabel}>{t('common.vessel_plural')}</label>
              <label className={styles.vesselsHeaderLabel}>{t('common.hour_plural')}</label>
            </div>
            {feature.vesselsInfo.vessels.map((vessel, i) => {
              const vesselLabel = vessel.shipname
                ? formatInfoField(vessel.shipname, 'name')
                : vessel.id
              return (
                <button key={i} className={styles.vesselRow} onClick={() => onVesselClick(vessel)}>
                  <span className={styles.vesselName}>
                    {vesselLabel.length > 25 ? `${vesselLabel.slice(0, 25)}...` : vesselLabel}
                    {vessel.dataset.name && (
                      <span className={styles.vesselRowLegend}> - {vessel.dataset.name}</span>
                    )}
                  </span>
                  <span>{formatNumber(vessel.hours)}</span>
                </button>
              )
            })}
            {feature.vesselsInfo.overflow && (
              <div className={styles.vesselsMore}>
                + {feature.vesselsInfo.numVessels - feature.vesselsInfo.vessels.length}{' '}
                {t('common.more')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default HeatmapTooltipRow
