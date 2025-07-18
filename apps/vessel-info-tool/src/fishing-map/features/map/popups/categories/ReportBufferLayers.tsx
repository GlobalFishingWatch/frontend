import type {
  ContextPickingObject,
  PolygonPickingObject,
  UserLayerPickingObject,
} from '@globalfishingwatch/deck-layers'
import { Icon } from '@globalfishingwatch/ui-components'

import { BUFFER_PREVIEW_COLOR } from 'data/config'

import styles from '../Popup.module.css'

type ReportBufferLayersProps = {
  features: (ContextPickingObject | UserLayerPickingObject | PolygonPickingObject)[]
}

function ReportBufferTooltip({ features }: ReportBufferLayersProps) {
  return features.length ? (
    <div className={styles.popupSection}>
      <Icon icon="polygons" className={styles.layerIcon} style={{ color: BUFFER_PREVIEW_COLOR }} />
      <div className={styles.popupSectionContent}>
        <span className={styles.rowText}>{features[0].title}</span>
      </div>
    </div>
  ) : null
}

export default ReportBufferTooltip
