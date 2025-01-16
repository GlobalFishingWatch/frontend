import React, { useId, useMemo } from 'react'
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
  headerClassName?: string
  contentId?: string
  contentClassName?: string
  overlayClassName?: string
  portalClassName?: string
  /**
   * Id of the html root selector, normally in CRA 'root'
   */
  appSelector?: string
  fullScreen?: boolean
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
    headerClassName,
    contentClassName,
    contentId,
    overlayClassName,
    closeButtonClassName,
    shouldCloseOnEsc = false,
    fullScreen = false,
    children,
  } = props
  const modalContentId = useId()

  const appElement = useMemo(
    () => (typeof window !== 'undefined' ? document.getElementById(appSelector) : null),
    [appSelector]
  )
  if (!appElement) {
    console.warn(`Invalid appSelector (${appSelector}) provided`)
    return null
  }

  return (
    <ReactModal
      portalClassName={portalClassName}
      overlayClassName={cx(styles.modalOverlay, overlayClassName)}
      shouldCloseOnOverlayClick={shouldCloseOnEsc}
      shouldCloseOnEsc={shouldCloseOnEsc}
      className={cx(styles.modalContentWrapper, className, { [styles.fullScreen]: fullScreen })}
      appElement={appElement}
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      {header ? (
        <div className={cx(styles.header, headerClassName, { [styles.withTitle]: title })}>
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
        id={contentId || modalContentId}
        className={cx(styles.content, contentClassName, {
          [styles.contentNoHeader]: !header,
        })}
      >
        {children}
      </div>
    </ReactModal>
  )
}
