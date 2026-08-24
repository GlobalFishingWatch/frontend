import { Dialog, Modal as AriaModal, ModalOverlay } from 'react-aria-components/Modal'
import cx from 'classnames'

import { IconButton } from '../icon-button'
import { Logo } from '../logo'

import type { MenuLink } from './Menu.constants'
import { defaultLinks } from './Menu.constants'

import styles from './Menu.module.css'

interface MenuProps {
  isOpen: boolean
  bgImage: string
  bgImageSource?: string
  links?: MenuLink[]
  activeLinkId?: string
  /** Accessible name for the dialog. */
  ariaLabel?: string
  onClose: () => void
}

export function Menu(props: MenuProps) {
  const {
    isOpen,
    onClose,
    links = defaultLinks,
    bgImage = 'https://globalfishingwatch.org/carrier-portal/static/media/juan-vilata.fc4bde7c.jpg',
    bgImageSource = '',
    activeLinkId,
    ariaLabel = 'Menu',
  } = props

  return (
    <ModalOverlay
      className={styles.modalOverlay}
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      isDismissable
    >
      <AriaModal
        className={styles.modalContentWrapper}
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <Dialog className={styles.dialog} aria-label={ariaLabel}>
          <div className={styles.header}>
            <a href="https://globalfishingwatch.org">
              <Logo type="invert" className={styles.logo} />
            </a>
            <IconButton className={styles.closeBtn} icon="close" type="invert" onClick={onClose} />
          </div>
          {links?.length > 0 && (
            <ul>
              {links.map(({ id, label, href }) => (
                <li className={cx(styles.link, { [styles.active]: id === activeLinkId })} key={id}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          )}
          {bgImageSource && <p className={styles.copyright}>{bgImageSource}</p>}
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  )
}
