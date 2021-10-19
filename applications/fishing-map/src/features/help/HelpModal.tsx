import React from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@globalfishingwatch/ui-components'
import styles from './HelpModal.module.css'

type HelpModalProps = {
  isOpen?: boolean
  onClose: () => void
}

function HelpModal({ isOpen = false, onClose }: HelpModalProps) {
  const { t } = useTranslation()

  return (
    <Modal
      title={t('common.help', 'help')}
      isOpen={isOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
    >
      <div className={styles.container}>HELP</div>
    </Modal>
  )
}

export default HelpModal
