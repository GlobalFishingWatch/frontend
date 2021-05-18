import React from 'react'
import { useTranslation } from 'react-i18next'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getVesselLabel } from 'utils/info'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { getRelatedDatasetByType } from 'features/datasets/datasets.selectors'
import I18nNumber from 'features/i18n/i18nNumber'
import { TooltipEventFeature, useClickedEventConnect } from 'features/map/map.hooks'
import { ExtendedFeatureVessel } from 'features/map/map.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import styles from './Popup.module.css'

// Translations by feature.unit static keys
// t('common.hour', 'Hour')
// t('common.days', 'Day')
// t('common.days_plural', 'Days')

type HeatmapTooltipRowProps = {
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
}
function HeatmapTooltipRow({ feature, showFeaturesDetails }: HeatmapTooltipRowProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { fourWingsStatus } = useClickedEventConnect()

  const onVesselClick = (vessel: ExtendedFeatureVessel) => {
    const infoDataset = getRelatedDatasetByType(vessel.dataset, DatasetTypes.Vessels)
    if (!infoDataset) {
      console.warn('Missing info related dataset for', vessel)
    }
    const trackDataset = getRelatedDatasetByType(vessel.dataset, DatasetTypes.Tracks)
    if (!trackDataset) {
      console.warn('Missing track related dataset for', vessel)
    }
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
            {t([`common.${feature.unit}` as any, 'common.hour'], 'hours', {
              count: parseInt(feature.value), // neded to select the plural automatically
            })}
          </span>
        </div>
        {fourWingsStatus === AsyncReducerStatus.Loading && (
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
                {t('common.hour_plural', 'hours')}
              </label>
            </div>
            {feature.vesselsInfo.vessels.map((vessel, i) => {
              const vesselLabel = getVesselLabel(vessel, true)
              return (
                <button
                  disabled={feature.category === 'presence'}
                  key={i}
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

export default HeatmapTooltipRow
