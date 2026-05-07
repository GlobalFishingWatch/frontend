import { useTranslation } from 'react-i18next'

import { formatArea, type HotspotProperties } from 'features/reports/reports-hotspot.utils'

import styles from '../Popup.module.css'

type HotspotTooltipSectionProps = {
  properties: HotspotProperties
}

export default function HotspotTooltipSection({ properties }: HotspotTooltipSectionProps) {
  const { t } = useTranslation()
  const { areaKm2, totalHours, percentOfTotal } = properties
  return (
    <div className={`${styles.popupSection} ${styles.noIcon}`}>
      <div className={styles.popupSectionContent}>
        <p className={styles.rowText}>
          {t((t) => t.analysis.hotspot.tooltip, { areaKm2: formatArea(areaKm2) })}
        </p>
        <p className={styles.rowTextSecondary}>
          {t((t) => t.analysis.hotspot.tooltipAmmount, {
            ammount: Math.round(totalHours).toLocaleString(),
            percentage: percentOfTotal.toFixed(1),
          })}
        </p>
      </div>
    </div>
  )
}
