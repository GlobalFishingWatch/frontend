import type {
  ContextPickingObject,
  PolygonPickingObject,
  UserLayerPickingObject,
} from '@globalfishingwatch/deck-layers'

import { BUFFER_PREVIEW_COLOR } from 'data/map/config'

import PopupSectionLayout from '../shared/PopupSectionLayout'

import styles from '../Popup.module.css'

type ReportBufferTooltipSectionProps = {
  features: (ContextPickingObject | UserLayerPickingObject | PolygonPickingObject)[]
}

function ReportBufferTooltipSection({ features }: ReportBufferTooltipSectionProps) {
  return features.length ? (
    <PopupSectionLayout icon="polygons" iconColor={BUFFER_PREVIEW_COLOR}>
      <span className={styles.rowText}>{features[0].title}</span>
    </PopupSectionLayout>
  ) : null
}

export default ReportBufferTooltipSection
