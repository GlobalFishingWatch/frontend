import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon, Spinner } from '@globalfishingwatch/ui-components'
import I18nNumber from 'features/i18n/i18nNumber'
import { TooltipEventFeature, TooltipEventFeatureVesselsInfo } from 'features/map/map.hooks'
import VesselsTable, { VesselDetectionTimestamps } from 'features/map/popups/VesselsTable'
import styles from './Popup.module.css'

type ViirsMatchTooltipRowProps = {
  feature: TooltipEventFeature
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
  const matchedVessels: TooltipEventFeatureVesselsInfo['vessels'] = (
    feature.vesselsInfo?.vessels || []
  ).filter((v: any) => v.id !== null)
  const matchedDetections = matchedVessels
    ? matchedVessels.reduce((acc, vessel: any) => acc + vessel.detections, 0)
    : 0
  const featureVesselsFilter: any = {
    ...feature,
    vesselsInfo: {
      ...feature.vesselsInfo,
      vessels: matchedVessels,
    } as TooltipEventFeatureVesselsInfo,
  }
  const notMatchedDetectionsCount = parseInt(feature.value) - matchedDetections
  const notMatchedDetection = feature.vesselsInfo?.vessels?.find((v: any) => v.id === null)

  return (
    <div className={styles.popupSection}>
      <Icon icon="heatmap" className={styles.layerIcon} style={{ color: feature.color }} />
      <div className={styles.popupSectionContent}>
        {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
        <div className={styles.row}>
          <span className={styles.rowText}>
            <I18nNumber number={feature.value} />{' '}
            {t([`common.${feature.temporalgrid?.unit}` as any, 'common.detection'], 'detections', {
              count: parseInt(feature.value), // neded to select the plural automatically
            })}{' '}
            {showFeaturesDetails && notMatchedDetectionsCount >= 0 && (
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
          <VesselsTable feature={featureVesselsFilter} vesselProperty="detections" />
        )}
      </div>
    </div>
  )
}

export default ViirsMatchTooltipRow
