import { Icon } from '@globalfishingwatch/ui-components'
import { TooltipEventFeature } from 'features/map/map.hooks'
import styles from './Popup.module.css'

type ReportBufferLayersProps = {
  features: TooltipEventFeature[]
}

function ReportBufferTooltip({ features }: ReportBufferLayersProps) {
  return features.length ? (
    <div className={styles.popupSection}>
      <Icon icon="polygons" className={styles.layerIcon} style={{ color: '#ededed' }} />
      <div className={styles.popupSectionContent}>
        <span className={styles.rowText}>{features[0].value}</span>
      </div>
    </div>
  ) : null
}

export default ReportBufferTooltip
