import React from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import { WorkspaceCategories } from 'data/workspaces'
import { selectLocationCategory } from 'routes/routes.selectors'
import LogoDonaBertarelli from 'assets/images/partner-logos/dona-bertarelli@2x.png'
import LogoOceana from 'assets/images/partner-logos/oceana@2x.png'
import LogoSkytruth from 'assets/images/partner-logos/skytruth@2x.png'
import LogoGoogle from 'assets/images/partner-logos/google@2x.png'
import styles from './Footer.module.css'

export const FOOTER_HEIGHT = 24

const FooterPartners = () => {
  const category = useSelector(selectLocationCategory)
  const { t } = useTranslation()
  switch (category) {
    case WorkspaceCategories.MarineManager:
      return (
        <div className={styles.partners}>
          <span className={styles.text}>{t('footer.supportBy', 'Supported by')}</span>
          <a href="https://donabertarelli.com/" rel="noopener noreferrer" target="_blank">
            <Image src={LogoDonaBertarelli} alt="Dona Bertarelli" width="129px" />
          </a>
        </div>
      )
    default:
      return (
        <div className={styles.partners}>
          <span className={styles.text}>{t('footer.convenedBy', 'A partnership convened by')}</span>
          <a href="https://oceana.org/" rel="noopener noreferrer" target="_blank">
            <Image src={LogoOceana} alt="Oceana" width="64px" height="24px" />
          </a>
          <a href="https://skytruth.org/" rel="noopener noreferrer" target="_blank">
            <Image src={LogoSkytruth} alt="Skytruth" width="79px" height="24px" />
          </a>
          <a href="https://google.com/" rel="noopener noreferrer" target="_blank">
            <Image src={LogoGoogle} alt="Google" width="57px" height="24px" />
          </a>
        </div>
      )
  }
}

function Footer(): React.ReactElement {
  return (
    <footer className={cx('print-hidden', styles.footer)}>
      <FooterPartners />
      <span className={styles.text}>© Global Fishing Watch {new Date().getFullYear()}</span>
    </footer>
  )
}

export default Footer
