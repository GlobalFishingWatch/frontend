import React, { useMemo } from 'react'
import ReactModal from 'react-modal'
import cx from 'classnames'
import IconButton from '../icon-button'
import styles from './Modal.module.css'

interface ModalProps {
  isOpen: boolean
  header?: string
  /**
   * Id of the html root selector, normally in CRA 'root'
   */
  appSelector?: string
  children: React.ReactNode
  onClose: (e: React.MouseEvent) => void
}

const Modal: React.FC<ModalProps> = (props) => {
  const { isOpen, onClose, appSelector = 'root', header, children } = props
  const appElement = useMemo(() => document.getElementById(appSelector), [appSelector])
  if (!appElement) {
    console.warn(`Invalid appSelector (${appSelector}) provided`)
    return null
  }
  return (
    <ReactModal
      overlayClassName={styles.modalOverlay}
      className={styles.modalContentWrapper}
      appElement={appElement}
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      {header && <div className={styles.header}>{header}</div>}
      <IconButton className={styles.closeBtn} icon="close" onClick={onClose} />
      <div className={cx(styles.content, { [styles.contentNoHeader]: !header })}>{children}</div>
    </ReactModal>
  )
}

export default Modal
