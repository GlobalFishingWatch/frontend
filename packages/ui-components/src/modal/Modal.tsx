import React, { useMemo, memo } from 'react'
import ReactModal from 'react-modal'
import cx from 'classnames'
import IconButton from '../icon-button'
import styles from './Modal.module.css'

interface ModalProps {
  isOpen: boolean
  title?: string
  header?: boolean
  contentClassName?: string
  /**
   * Id of the html root selector, normally in CRA 'root'
   */
  appSelector?: string
  children: React.ReactNode
  onClose: (e: React.MouseEvent) => void
}

function Modal(props: ModalProps) {
  const {
    isOpen,
    onClose,
    appSelector = 'root',
    header = true,
    title,
    contentClassName,
    children,
  } = props
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
      {header && (
        <div className={cx(styles.header, { [styles.withTitle]: title })}>
          <h1 className={styles.title}>{title}</h1>
          <IconButton icon="close" tooltip="Dismiss" tooltipPlacement="left" onClick={onClose} />
        </div>
      )}
      <div className={cx(styles.content, contentClassName, { [styles.contentNoHeader]: !header })}>
        {children}
      </div>
    </ReactModal>
  )
}

export default memo(Modal)
