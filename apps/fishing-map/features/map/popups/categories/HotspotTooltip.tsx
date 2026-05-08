import { useTranslation } from 'react-i18next'

import { NAUTICAL_MILES } from 'features/reports/report-area/area-reports.config'
import { formatArea, type HotspotProperties } from 'features/reports/reports-hotspot.utils'

import styles from '../Popup.module.css'

type HotspotTooltipSectionProps = {
  properties: HotspotProperties
}

export default function HotspotTooltipSection({ properties }: HotspotTooltipSectionProps) {
  const { t } = useTranslation()
  const { area, unit, totalHours, percentOfTotal } = properties
  const unitLabel = unit === NAUTICAL_MILES ? 'nm²' : 'km²'
  return (
    <div className={`${styles.popupSection} ${styles.noIcon}`}>
      <div className={styles.popupSectionContent}>
        <p className={styles.rowText}>
          {t((t) => t.analysis.hotspot.tooltip, { area: formatArea(area), unit: unitLabel })}
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
