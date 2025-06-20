import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components'

import { useMapErrorNotification } from 'features/map/overlays/error-notification/error-notification.hooks'
import { useSetTrackCorrectionId } from 'features/track-correction/track-correction.hooks'
import { selectTrackCorrectionModalOpen } from 'features/track-correction/track-selection.selectors'

import styles from './ReportControl.module.css'

const ReportControls = ({ disabled = false }: { disabled?: boolean }) => {
  const { t } = useTranslation()
  const setTrackCorrectionId = useSetTrackCorrectionId()
  const trackCorrectionModalOpen = useSelector(selectTrackCorrectionModalOpen)
  const { isErrorNotificationEditing, toggleErrorNotification } = useMapErrorNotification()

  const onErrorNotificationClick = useCallback(() => {
    if (trackCorrectionModalOpen) {
      setTrackCorrectionId('')
    }
    toggleErrorNotification()
  }, [setTrackCorrectionId, toggleErrorNotification, trackCorrectionModalOpen])

  return (
    <IconButton
      icon="feedback-error"
      type="map-tool"
      disabled={disabled}
      tooltip={t('map.errorAction', 'Log an issue at a specific location')}
      onClick={onErrorNotificationClick}
      className={cx({ [styles.active]: isErrorNotificationEditing })}
    />
  )
}

export default ReportControls
