import type React from 'react'
import { useId } from 'react'
import { Dialog, Heading, Modal as AriaModal, ModalOverlay } from 'react-aria-components/Modal'
import cx from 'classnames'

import { IconButton } from '../icon-button'

import styles from './Modal.module.css'

type ModalBaseProps = {
  isOpen: boolean
  title?: string | React.ReactNode
  className?: string
  shouldCloseOnEsc?: boolean
  contentId?: string
  contentClassName?: string
  size?: 'fullscreen' | 'default' | 'auto'
  children: React.ReactNode
  onClose: () => void
}

/**
 * With a header, the dialog is named by its title heading. Without one — or when `header` is
 * computed, so it may be false at runtime — `ariaLabel` is the only thing left to name it by,
 * so the type requires it.
 */
type ModalProps = ModalBaseProps &
  ({ header?: true; ariaLabel?: string } | { header: boolean; ariaLabel: string })

export function Modal(props: ModalProps) {
  const {
    isOpen,
    onClose,
    header = true,
    title,
    className,
    contentClassName,
    contentId,
    ariaLabel,
    shouldCloseOnEsc = false,
    size = 'default',
    children,
  } = props
  const modalContentId = useId()

  return (
    <ModalOverlay
      data-modal-overlay
      className={styles.modalOverlay}
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      isDismissable={shouldCloseOnEsc}
      isKeyboardDismissDisabled={!shouldCloseOnEsc}
    >
      <AriaModal
        className={cx(styles.modalContentWrapper, className, {
          [styles.fullScreen]: size === 'fullscreen',
          [styles.auto]: size === 'auto',
        })}
      >
        <Dialog className={styles.dialog} aria-label={ariaLabel}>
          {header ? (
            <div className={cx(styles.header, { [styles.withTitle]: title })}>
              <Heading slot="title" level={1} className={styles.title}>
                {title}
              </Heading>
              <IconButton icon="close" onClick={onClose} data-testid="modal-close-button" />
            </div>
          ) : (
            <IconButton
              icon="close"
              data-testid="modal-close-button"
              onClick={onClose}
              type="border"
              className={styles.closeButtonWithoutHeader}
            />
          )}
          <div
            id={contentId || modalContentId}
            className={cx(styles.content, contentClassName, {
              [styles.contentNoHeader]: !header,
              [styles.contentAuto]: size === 'auto',
            })}
          >
            {children}
          </div>
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  )
}
