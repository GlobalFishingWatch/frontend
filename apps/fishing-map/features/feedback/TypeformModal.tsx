import { Widget } from '@typeform/embed-react'

import { Modal } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/config'

import styles from 'features/modals/Modals.module.css'

type TypeformModalProps = {
  isOpen?: boolean
  onClose: () => void
}

const TYPEFORM_ID = 'arg1MSZh'

function TypeformModal({ isOpen = false, onClose }: TypeformModalProps) {
  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={'Success story test'}
      isOpen={isOpen}
      onClose={onClose}
      contentClassName={styles.layerLibraryModal}
      shouldCloseOnEsc
      size="fullscreen"
    >
      <Widget id={TYPEFORM_ID} style={{ width: '100%', height: '100%' }} />
    </Modal>
  )
}

export default TypeformModal
