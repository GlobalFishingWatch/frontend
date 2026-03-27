import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import type { DataviewCategory, SelfReportedInfo } from '@globalfishingwatch/api-types'
import { Icon, Spinner } from '@globalfishingwatch/ui-components'

import { getIsSkylightDataset } from 'features/datasets/datasets.utils'
import I18nNumber from 'features/i18n/i18nNumber'
import VesselDetectionTimestamps from 'features/map/popups/categories/VesselDetectionTimestamps'
import VesselsTable, { getVesselsInfoConfig } from 'features/map/popups/categories/VesselsTable'

import type { ExtendedFeatureVessel, SliceExtendedFourwingsDeckSublayer } from '../../map.slice'

import styles from '../Popup.module.css'

type DetectionsTooltipRowProps = {
  feature: SliceExtendedFourwingsDeckSublayer & { category: DataviewCategory; title?: string }
  loading?: boolean
  error?: string
  showFeaturesDetails: boolean
}

function DetectionsTooltipRow({
  feature,
  showFeaturesDetails,
  loading,
  error,
}: DetectionsTooltipRowProps) {
  const { t } = useTranslation()
  // Avoid showing not matched detections
  const vesselsInfo = getVesselsInfoConfig(feature.vessels || [])
  const hasVesselsResolved = feature?.vessels && feature?.vessels?.length > 0
  const matchedVessels: SliceExtendedFourwingsDeckSublayer['vessels'] = (feature?.vessels || [])
    // newly added skylight vessels could include skylight_id
    .filter((v) => v.id || v.skylight_id)
  const matchedDetections = hasVesselsResolved
    ? matchedVessels.reduce((acc, vessel: any) => acc + vessel.detections, 0)
    : 0
  const featureVesselsFilter = {
    ...feature,
    vesselsInfo: {
      vesselsInfo,
      vessels: matchedVessels,
    },
  }
  const notMatchedDetectionsCount = feature.value! - matchedDetections
  const notMatchedDetection = feature?.vessels?.find((v: any) => v.id === null)

  const isSkylight = feature.datasets.some((d) => getIsSkylightDataset(d))
  if (isSkylight) {
    featureVesselsFilter.vessels = matchedVessels.map((vessel: ExtendedFeatureVessel) => ({
      ...vessel,
      selfReportedInfo: [
        {
          id: vessel.id,
          shipname: (vessel as any).shipname,
          flag: (vessel as any).flag,
        } as SelfReportedInfo,
      ],
    }))
  }

  return (
    <div className={styles.popupSection}>
      <Icon icon="heatmap" className={styles.layerIcon} style={{ color: feature.color }} />
      <div className={styles.popupSectionContent}>
        {showFeaturesDetails && feature.title && (
          <h3 className={styles.popupSectionTitle}>{feature.title}</h3>
        )}
        <div className={styles.row}>
          <span className={styles.rowText}>
            {feature.value && (
              <Fragment>
                <I18nNumber number={feature.value} />{' '}
              </Fragment>
            )}
            {t((t: any) => t.common[feature?.unit ?? 'detections'], {
              defaultValue: 'detections',
              count: feature.value, // neded to select the plural automatically
            })}{' '}
            {feature?.vessels && showFeaturesDetails && notMatchedDetectionsCount > 0 && (
              <Fragment>
                {' - '}
                <I18nNumber number={notMatchedDetectionsCount} /> {t((t) => t.vessel.unmatched)}{' '}
                {notMatchedDetection && <VesselDetectionTimestamps vessel={notMatchedDetection} />}
              </Fragment>
            )}
          </span>
        </div>
        {loading && (
          <div className={styles.loading}>
            <Spinner size="small" />
          </div>
        )}
        {!loading && error && <p className={styles.error}>{error}</p>}
        {!loading && showFeaturesDetails && (
          <VesselsTable
            linkToSkylight={isSkylight}
            feature={{ ...featureVesselsFilter, category: feature.category }}
            vesselProperty="detections"
          />
        )}
      </div>
    </div>
  )
}

export default DetectionsTooltipRow
