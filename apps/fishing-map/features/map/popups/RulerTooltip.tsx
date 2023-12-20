import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { TooltipEventFeature } from 'features/map/map.hooks'
import useRulers from 'features/map/rulers/rulers.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { setClickedEvent } from 'features/map/map.slice'
import styles from './Popup.module.css'

type RulerTooltipProps = {
  features: TooltipEventFeature[]
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
  const { id, lengthLabel } = feature.properties

  const onDeleteClick = () => {
    deleteMapRuler(id)
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
