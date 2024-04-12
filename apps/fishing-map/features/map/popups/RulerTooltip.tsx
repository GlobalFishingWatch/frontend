import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { RulerPickingObject } from '@globalfishingwatch/deck-layers'
import useRulers from 'features/map/overlays/rulers/rulers.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { setClickedEvent } from 'features/map/map.slice'
import styles from './Popup.module.css'

type RulerTooltipProps = {
  features: RulerPickingObject[]
  showFeaturesDetails: boolean
}

function RulerTooltip({ features, showFeaturesDetails }: RulerTooltipProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { deleteMapRuler } = useRulers()

  const feature = features?.[0]
  if (!feature) {
    return null
  }
  // TODO:deck review if getRulerLength is needed
  const { id, lengthLabel } = feature.properties

  const onDeleteClick = () => {
    if (id) {
      deleteMapRuler(id)
    }
    dispatch(setClickedEvent(null))
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
