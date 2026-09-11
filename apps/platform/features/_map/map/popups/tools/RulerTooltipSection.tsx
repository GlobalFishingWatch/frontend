import { useTranslation } from 'react-i18next'

import type { RulerPickingObject } from '@globalfishingwatch/deck-layers'
import { IconButton } from '@globalfishingwatch/ui-components'

import { useClickedEventConnect } from 'features/_map/map/map-interactions.hooks'
import useRulers from 'features/_map/map/overlays/rulers/rulers.hooks'

import PopupSectionLayout from '../shared/PopupSectionLayout'

import styles from '../Popup.module.css'

type RulerTooltipSectionProps = {
  features: RulerPickingObject[]
  showFeaturesDetails: boolean
}

function RulerTooltipSection({ features, showFeaturesDetails }: RulerTooltipSectionProps) {
  const { t } = useTranslation()
  const { deleteMapRuler } = useRulers()
  const { dispatchClickedEvent } = useClickedEventConnect()

  const feature = features?.[0]
  if (!feature) {
    return null
  }
  const { id, lengthLabel } = feature.properties

  const onDeleteClick = () => {
    if (id) {
      deleteMapRuler(id)
    }
    dispatchClickedEvent(null)
  }

  return (
    <PopupSectionLayout className={styles.withoutIcon}>
      {showFeaturesDetails ? (
        <div className={styles.rulerContainer}>
          <span>{lengthLabel}</span>
          {id && <IconButton size="small" icon="delete" type="warning" onClick={onDeleteClick} />}
        </div>
      ) : (
        <span className={styles.rowText}>{t((t) => t.map.rulersHover)}</span>
      )}
    </PopupSectionLayout>
  )
}

export default RulerTooltipSection
