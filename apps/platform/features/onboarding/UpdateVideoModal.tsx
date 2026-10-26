import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Modal } from '@globalfishingwatch/ui-components/modal'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectUpdateVideoWithSound, setModalOpen } from 'features/modals/modals.slice'
import {
  useOnboardingDismissed,
  useUpdateVideoSeen,
} from 'features/onboarding/onboarding.auto-open.hooks'
import { UPDATE_VIDEO_SOURCES } from 'features/onboarding/onboarding.config'
import VideoPlayer from 'features/video/VideoPlayer'

import styles from './UpdateVideoModal.module.css'

function UpdateVideoModal() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const [onboardingDismissed] = useOnboardingDismissed()
  const [, setVideoSeen] = useUpdateVideoSeen()
  const withSound = useSelector(selectUpdateVideoWithSound)

  const close = () => {
    setVideoSeen(true)
    dispatch(setModalOpen({ id: 'updateVideo', open: false }))
    if (!onboardingDismissed) {
      dispatch(setModalOpen({ id: 'onboarding', open: true }))
    }
  }

  return (
    <Modal
      isOpen
      header={false}
      ariaLabel={t((t) => t.updateVideo.title)}
      shouldCloseOnEsc
      className={styles.modal}
      contentClassName={styles.content}
      onClose={close}
    >
      <VideoPlayer
        sources={UPDATE_VIDEO_SOURCES}
        language={i18n.language.slice(0, 2)}
        autoPlay
        startMuted={!withSound}
        onEnded={close}
      />
    </Modal>
  )
}

export default UpdateVideoModal
