import { useTranslation } from 'react-i18next'

import { Spinner } from '@globalfishingwatch/ui-components'

import PopupWrapper from 'features/_map/map/popups/PopupWrapper'

import { usePendingDrawImportCenter } from './draw-pending.hooks'

import styles from './PendingDrawNotice.module.css'
import popupStyles from 'features/_map/map/popups/Popup.module.css'

function PendingDrawNotice() {
  const { t } = useTranslation()
  const center = usePendingDrawImportCenter()

  if (!center) {
    return null
  }

  return (
    <PopupWrapper
      latitude={center.latitude}
      longitude={center.longitude}
      showArrow={false}
      showClose={false}
      className={popupStyles.hover}
    >
      <div className={styles.content}>
        <Spinner size="tiny" color="var(--color-white)" inline />
        <span>{t((t) => t.dataset.importing)}</span>
      </div>
    </PopupWrapper>
  )
}

export default PendingDrawNotice
