import React, { useMemo, memo } from 'react'
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

function Modal(props: ModalProps) {
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
      <div className={cx(styles.header, { [styles.withTitle]: header })}>
        <h1 className={styles.title}>{header}</h1>
        <IconButton icon="close" onClick={onClose} />
      </div>
      <div className={cx(styles.content, { [styles.contentNoHeader]: !header })}>{children}</div>
    </ReactModal>
  )
}

export default memo(Modal)
