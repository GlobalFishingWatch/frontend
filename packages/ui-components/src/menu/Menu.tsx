import React, { useMemo } from 'react'
import ReactModal from 'react-modal'
import cx from 'classnames'
import IconButton from '../icon-button'
import Logo from '../logo'
import styles from './Menu.module.css'

type MenuLink = {
  id: string
  label: string
  href: string
  ariaLabel?: string
}

export const defaultLinks: MenuLink[] = [
  { id: 'about-us', label: 'About Us', href: 'https://globalfishingwatch.org/about-us/' },
  { id: 'map-data', label: 'Map & data', href: 'https://globalfishingwatch.org/map-and-data/' },
  { id: 'research', label: 'Research', href: 'https://globalfishingwatch.org/research/' },
  { id: 'blog', label: 'Blog', href: 'https://globalfishingwatch.org/blog/' },
  { id: 'news', label: 'News', href: 'https://globalfishingwatch.org/news/' },
  {
    id: 'get-involved',
    label: 'Get involved',
    href: 'https://globalfishingwatch.org/get-involved/',
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
  links?: MenuLink[]
  activeLinkId?: string
  onClose: (e: React.MouseEvent) => void
}

const Menu: React.FC<MenuProps> = (props) => {
  const { isOpen, onClose, appSelector = 'root', links = defaultLinks, activeLinkId } = props
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
      closeTimeoutMS={400}
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <IconButton className={styles.closeBtn} icon="close" type="invert" onClick={onClose} />
      <Logo type="invert" />
      {links?.length > 0 && (
        <ul>
          {links.map(({ id, label, href, ariaLabel }) => (
            <li className={cx(styles.link, { [styles.active]: id === activeLinkId })} key={id}>
              <a aria-label={ariaLabel || 'Global Fishing Watch link'} href={href}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
      <p className={styles.copyright}>© Jiri Rezac / Greenpeace</p>
    </ReactModal>
  )
}

export default Menu
