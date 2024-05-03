import { Icon } from '@globalfishingwatch/ui-components'
import { ContextPickingObject, UserPolygonsPickingObject } from '@globalfishingwatch/deck-layers'
import { BUFFER_PREVIEW_COLOR } from 'data/config'
import styles from './Popup.module.css'

type ReportBufferLayersProps = {
  features: (ContextPickingObject | UserPolygonsPickingObject)[]
}

function ReportBufferTooltip({ features }: ReportBufferLayersProps) {
  return features.length ? (
    <div className={styles.popupSection}>
      <Icon icon="polygons" className={styles.layerIcon} style={{ color: BUFFER_PREVIEW_COLOR }} />
      <div className={styles.popupSectionContent}>
        <span className={styles.rowText}>{features[0].value}</span>
      </div>
    </div>
  ) : null
}

export default ReportBufferTooltip
