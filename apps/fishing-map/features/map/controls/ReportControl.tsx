import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { IconButton, Popover } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { useMapErrorNotification } from 'features/map/overlays/error-notification/error-notification.hooks'
import { selectTrackCorrectionModalOpen, setModalOpen } from 'features/modals/modals.slice'

import styles from './ReportControl.module.css'

const ReportControls = ({ disabled = false }: { disabled?: boolean }) => {
  const { t } = useTranslation()
  const [reportControlsOpen, setReportControlsOpen] = useState(false)
  const dispatch = useAppDispatch()
  const trackCorrectionModalOpen = useSelector(selectTrackCorrectionModalOpen)
  const { isErrorNotificationEditing, toggleErrorNotification } = useMapErrorNotification()

  const toggleReportControlsOpen = useCallback(() => {
    setReportControlsOpen(!reportControlsOpen)
  }, [reportControlsOpen])

  const onErrorNotificationClick = useCallback(() => {
    if (trackCorrectionModalOpen) {
      dispatch(setModalOpen({ id: 'trackCorrection', open: false }))
    }
    toggleErrorNotification()
    setReportControlsOpen(false)
  }, [dispatch, toggleErrorNotification, trackCorrectionModalOpen])

  const onTrackCorrectionClick = useCallback(() => {
    if (isErrorNotificationEditing) {
      toggleErrorNotification()
    }
    dispatch(setModalOpen({ id: 'trackCorrection', open: true }))
    setReportControlsOpen(false)
  }, [dispatch, isErrorNotificationEditing, toggleErrorNotification])

  return (
    <Popover
      open={reportControlsOpen}
      onOpenChange={toggleReportControlsOpen}
      placement="left"
      content={
        <ul className={styles.groupOptions}>
          <li
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
            role="button"
            className={cx(styles.groupOption)}
            onClick={onErrorNotificationClick}
            key="new-group"
          >
            {t('map.errorAction', 'Log an issue at a specific location')}
          </li>
          <li
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
            role="button"
            className={cx(styles.groupOption)}
            onClick={onTrackCorrectionClick}
            key="track-correction"
          >
            {t('map.errorVessel', 'Log an issue at a specific vessel')}
          </li>
        </ul>
      }
    >
      <div>
        <IconButton
          icon="feedback-error"
          type="map-tool"
          disabled={disabled}
          tooltip={t('map.errorTooltip', 'Log an issue')}
          onClick={toggleReportControlsOpen}
          className={cx({
            [styles.active]:
              reportControlsOpen || isErrorNotificationEditing || trackCorrectionModalOpen,
          })}
        />
      </div>
    </Popover>
  )
}

export default ReportControls
