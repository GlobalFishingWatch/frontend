import React from 'react'
import cx from 'classnames'
import { ReactComponent as IconClose } from 'assets/icons/close.svg'
import { ReactComponent as Logo } from 'assets/images/gfw-white.svg'
import IconButton from 'components/icon-button/icon-button'
import styles from './menu.module.css'

interface MenuProps {
  onCloseClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Menu: React.FC<MenuProps> = (props): React.ReactElement => {
  const { onCloseClick } = props
  return (
    <div className={styles.mainNav}>
      <ul aria-label="navigation-bar">
        <li className={styles.link}>
          <a href="https://globalfishingwatch.org/" aria-label="Home">
            <Logo className={styles.logoWhite} />
          </a>
        </li>
        <li className={styles.link}>
          <a aria-label="Global Fishing Watch link" href="https://globalfishingwatch.org/about-us/">
            About Us
          </a>
        </li>
        <li className={cx(styles.link, styles.active)}>
          <a
            aria-label="Global Fishing Watch link"
            href="https://globalfishingwatch.org/map-and-data/"
          >
            Map & data
          </a>
        </li>
        <li className={styles.link}>
          <a aria-label="Global Fishing Watch link" href="https://globalfishingwatch.org/research/">
            Research
          </a>
        </li>
        <li className={styles.link}>
          <a aria-label="Global Fishing Watch link" href="https://globalfishingwatch.org/blog/">
            Blog
          </a>
        </li>
        <li className={styles.link}>
          <a aria-label="Global Fishing Watch link" href="https://globalfishingwatch.org/news/">
            News
          </a>
        </li>
        <li className={styles.link}>
          <a
            aria-label="Global Fishing Watch link"
            href="https://globalfishingwatch.org/get-involved/"
          >
            Get involved
          </a>
        </li>
        <li className={styles.link}>
          <a
            aria-label="Global Fishing Watch link"
            href="https://globalfishingwatch.org/terms-of-use/"
          >
            Terms of use
          </a>
        </li>
        <li className={styles.link}>
          <a
            aria-label="Global Fishing Watch link"
            href="https://globalfishingwatch.org/privacy-policy/"
          >
            Privacy policy
          </a>
        </li>
      </ul>
      <p className={styles.copyright}>© Juan Vilata</p>
      <IconButton
        className={styles.closeButton}
        onClick={onCloseClick}
        aria-label="Close menu"
        data-tip-pos="left"
      >
        <IconClose />
      </IconButton>
    </div>
  )
}

export default Menu
