import React, { useMemo } from 'react'
import ReactModal from 'react-modal'
import cx from 'classnames'

import { IconButton } from '../icon-button'
import { Logo } from '../logo'

import styles from './Menu.module.css'

type MenuLink = {
  id: string
  label: string
  href: string
}

export const defaultLinks: MenuLink[] = [
  { id: 'topics', label: 'Topics', href: 'https://globalfishingwatch.org/topics/' },
  { id: 'map-data', label: 'Map & data', href: 'https://globalfishingwatch.org/map-and-data/' },
  { id: 'programs', label: 'Programs', href: 'https://globalfishingwatch.org/programs/' },
  { id: 'newsroom', label: 'Newsroom', href: 'https://globalfishingwatch.org/newsroom/' },
  { id: 'about-us', label: 'About Us', href: 'https://globalfishingwatch.org/about-us/' },
  {
    id: 'help',
    label: 'Help',
    href: 'https://globalfishingwatch.org/help-faqs/',
  },
  {
    id: 'terms-of-use',
    label: 'Terms of use',
    href: 'https://globalfishingwatch.org/terms-of-use/',
  },
  {
    id: 'privacy-policy',
    label: 'Privacy policy',
    href: 'https://globalfishingwatch.org/privacy-policy/',
  },
]

interface MenuProps {
  isOpen: boolean
  /**
   * Id of the html root selector, normally in CRA 'root'
   */
  appSelector?: string
  bgImage: string
  bgImageSource?: string
  links?: MenuLink[]
  activeLinkId?: string
  onClose: (e: React.MouseEvent) => void
}

export function Menu(props: MenuProps) {
  const {
    isOpen,
    onClose,
    appSelector = 'root',
    links = defaultLinks,
    bgImage = 'https://globalfishingwatch.org/carrier-portal/static/media/juan-vilata.fc4bde7c.jpg',
    bgImageSource = '',
    activeLinkId,
  } = props
  const appElement = useMemo(
    () => (typeof window !== 'undefined' ? document.getElementById(appSelector) : null),
    [appSelector]
  )
  if (!appElement) {
    console.warn(`Invalid appSelector (${appSelector}) provided`)
    return null
  }
  const customStyles = {
    content: {
      backgroundImage: `url(${bgImage})`,
    },
  }
  return (
    <ReactModal
      overlayClassName={styles.modalOverlay}
      className={styles.modalContentWrapper}
      appElement={appElement}
      closeTimeoutMS={400}
      style={customStyles}
      isOpen={isOpen}
      onRequestClose={onClose}
    >
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
    </ReactModal>
  )
}
