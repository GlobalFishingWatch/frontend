import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { RulerPickingObject } from '@globalfishingwatch/deck-layers'
import { IconButton } from '@globalfishingwatch/ui-components'

import { useClickedEventConnect } from 'features/map/map-interactions.hooks'
import useRulers from 'features/map/overlays/rulers/rulers.hooks'

import styles from '../Popup.module.css'

type RulerTooltipProps = {
  features: RulerPickingObject[]
  showFeaturesDetails: boolean
}

function RulerTooltip({ features, showFeaturesDetails }: RulerTooltipProps) {
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
    <div className={cx(styles.popupSection, styles.withoutIcon)}>
      <div className={styles.popupSectionContent}>
        {showFeaturesDetails ? (
          <div className={styles.rulerContainer}>
            <span>{lengthLabel}</span>
            {id && <IconButton size="small" icon="delete" type="warning" onClick={onDeleteClick} />}
          </div>
        ) : (
          <span className={styles.rowText}>
            {t('map.rulersHover', 'Drag to move or click to see more')}
          </span>
        )}
      </div>
    </div>
  )
}

export default RulerTooltip
