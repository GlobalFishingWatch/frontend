import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { DeckLayerPickingObject } from '@globalfishingwatch/deck-layers'

import { selectIsGuestUser } from 'features/user/selectors/user.selectors'

import styles from '../Popup.module.css'

type AnnotationTooltipProps = {
  features: DeckLayerPickingObject[]
}

function AnnotationTooltip({ features }: AnnotationTooltipProps) {
  const { t } = useTranslation()
  const isGuestUser = useSelector(selectIsGuestUser)
  if (isGuestUser) {
    return null
  }
  return features.length ? (
    <div className={cx(styles.popupSection, styles.withoutIcon)}>
      <div className={styles.popupSectionContent}>
        <span className={styles.rowText}>
          {t('map.annotationsHover', 'Drag to move or click to edit annotation')}
        </span>
      </div>
    </div>
  ) : null
}

export default AnnotationTooltip
