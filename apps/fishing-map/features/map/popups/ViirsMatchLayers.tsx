import React, { useMemo } from 'react'
import { groupBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import I18nNumber from 'features/i18n/i18nNumber'
import { TooltipEventFeature } from 'features/map/map.hooks'
import VesselsTable from 'features/map/popups/VesselsTable'
import styles from './Popup.module.css'

type ViirsMatchTooltipRowProps = {
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
}
function ViirsMatchTooltipRow({ feature, showFeaturesDetails }: ViirsMatchTooltipRowProps) {
  const { t } = useTranslation()

  const featureWithVessels = useMemo(() => {
    const viirsGroupedByVessel = groupBy(feature.viirs, 'vessel.id')
    const vesselsGrouped = Object.values(viirsGroupedByVessel)
      .sort((a, b) => b.length - a.length)
      .map((radiances) => {
        return radiances.reduce((acc, radiance) => {
          if (!acc) {
            acc = { ...radiance.vessel, radiance: 0 }
          }
          acc.radiance += radiance.radiance
          return acc
        }, null as any)
      })
    return { ...feature, vesselsInfo: { vessels: vesselsGrouped } } as any
  }, [feature])

  return (
    <div className={styles.popupSection}>
      <span className={styles.popupSectionColor} style={{ backgroundColor: feature.color }} />
      <div className={styles.popupSectionContent}>
        {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
        <div className={styles.row}>
          <span className={styles.rowText}>
            <I18nNumber number={feature.value} />{' '}
            {t([`common.${feature.temporalgrid?.unit}` as any, 'common.detection'], 'detections', {
              count: parseInt(feature.value), // neded to select the plural automatically
            })}
          </span>
        </div>
        {showFeaturesDetails && (
          <VesselsTable feature={featureWithVessels} vesselProperty="radiance" />
        )}
      </div>
    </div>
  )
}

export default ViirsMatchTooltipRow
