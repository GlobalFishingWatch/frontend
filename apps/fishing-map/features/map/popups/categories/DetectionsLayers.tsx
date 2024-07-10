import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon, Spinner } from '@globalfishingwatch/ui-components'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import I18nNumber from 'features/i18n/i18nNumber'
import VesselsTable, {
  VesselDetectionTimestamps,
} from 'features/map/popups/categories/VesselsTable'
import { SliceExtendedFourwingsDeckSublayer } from '../../map.slice'
import { getVesselsInfoConfig } from '../../map.hooks'
import styles from '../Popup.module.css'

type ViirsMatchTooltipRowProps = {
  feature: SliceExtendedFourwingsDeckSublayer & { category: DataviewCategory; title?: string }
  loading?: boolean
  showFeaturesDetails: boolean
}
function ViirsMatchTooltipRow({
  feature,
  showFeaturesDetails,
  loading,
}: ViirsMatchTooltipRowProps) {
  const { t } = useTranslation()
  // Avoid showing not matched detections
  const vesselsInfo = getVesselsInfoConfig(feature.vessels || [])
  const hasVesselsResolved = feature?.vessels?.length > 0
  const matchedVessels: SliceExtendedFourwingsDeckSublayer['vessels'] = (
    feature?.vessels || []
  ).filter((v: any) => v.id !== null)
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
            {t([`common.${feature?.unit}` as any, 'common.detection'], 'detections', {
              count: feature.value, // neded to select the plural automatically
            })}{' '}
            {hasVesselsResolved && showFeaturesDetails && notMatchedDetectionsCount >= 0 && (
              <Fragment>
                {' - '}
                <I18nNumber number={notMatchedDetectionsCount} />{' '}
                {t('vessel.unmatched', 'unmatched')}{' '}
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
        {!loading && showFeaturesDetails && (
          <VesselsTable
            feature={{ ...featureVesselsFilter, category: feature.category }}
            vesselProperty="detections"
          />
        )}
      </div>
    </div>
  )
}

export default ViirsMatchTooltipRow