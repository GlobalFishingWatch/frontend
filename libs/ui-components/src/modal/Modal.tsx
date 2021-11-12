import React, { useMemo } from 'react'
import ReactModal from 'react-modal'
import cx from 'classnames'
import { IconButton } from '../icon-button'
import styles from './Modal.module.css'

interface ModalProps {
  isOpen: boolean
  title?: string | React.ReactNode
  header?: boolean
  className?: string
  closeButtonClassName?: string
  shouldCloseOnEsc?: boolean
  contentClassName?: string
  overlayClassName?: string
  portalClassName?: string
  /**
   * Id of the html root selector, normally in CRA 'root'
   */
  appSelector?: string
  children: React.ReactNode
  onClose: (e: React.MouseEvent) => void
}

export function Modal(props: ModalProps) {
  const {
    isOpen,
    onClose,
    appSelector = 'root',
    header = true,
    title,
    portalClassName,
    className,
    contentClassName,
    overlayClassName,
    closeButtonClassName,
    shouldCloseOnEsc = false,
    children,
  } = props
  const appElement = useMemo(() => document.getElementById(appSelector), [appSelector])
  if (!appElement) {
    console.warn(`Invalid appSelector (${appSelector}) provided`)
    return null
  }
  return (
    <ReactModal
      portalClassName={portalClassName}
      overlayClassName={cx(styles.modalOverlay, overlayClassName)}
      shouldCloseOnEsc={shouldCloseOnEsc}
      className={cx(styles.modalContentWrapper, className)}
      appElement={appElement}
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      {header ? (
        <div className={cx(styles.header, { [styles.withTitle]: title })}>
          <h1 className={styles.title}>{title}</h1>
          <IconButton icon="close" className={closeButtonClassName} onClick={onClose} />
        </div>
      ) : (
        <IconButton
          icon="close"
          onClick={onClose}
          type="border"
          className={cx(styles.closeButtonWithoutHeader, closeButtonClassName)}
        />
      )}
      <div
        className={cx(styles.content, contentClassName, {
          [styles.contentNoHeader]: !header,
        })}
      >
        {children}
      </div>
    </ReactModal>
  )
}
