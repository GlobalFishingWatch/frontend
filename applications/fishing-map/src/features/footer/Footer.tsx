import React from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { WorkspaceCategories } from 'data/workspaces'
import { selectLocationCategory } from 'routes/routes.selectors'
import LogoOceana from 'assets/images/partner-logos/oceana@2x.png'
import LogoSkytruth from 'assets/images/partner-logos/skytruth@2x.png'
import LogoGoogle from 'assets/images/partner-logos/google@2x.png'
import LogoDonaBertarelli from 'assets/images/partner-logos/dona-bertarelli@2x.png'
import styles from './Footer.module.css'

export const FOOTER_HEIGHT = 24

const getFooterPartners = (category: WorkspaceCategories) => {
  switch (category) {
    case WorkspaceCategories.MarineReserves:
      return (
        <div className={styles.partners}>
          <span className={styles.text}>Supported by</span>
          <a href="https://donabertarelli.com/" rel="noopener noreferrer">
            <img src={LogoDonaBertarelli} alt="Dona Bertarelli" width="129px" />
          </a>
        </div>
      )
    default:
      return (
        <div className={styles.partners}>
          <span className={styles.text}>A partnership convened by</span>
          <a href="https://oceana.org/" rel="noopener noreferrer">
            <img src={LogoOceana} alt="Oceana" width="64px" />
          </a>
          <a href="https://skytruth.org/" rel="noopener noreferrer">
            <img src={LogoSkytruth} alt="Skytruth" width="79px" />
          </a>
          <a href="https://google.com/" rel="noopener noreferrer">
            <img src={LogoGoogle} alt="Google" width="57px" />
          </a>
        </div>
      )
  }
}

function Footer(): React.ReactElement {
  const locationCategory = useSelector(selectLocationCategory)
  return (
    <footer className={cx('print-hidden', styles.footer)}>
      {getFooterPartners(locationCategory)}
      <span className={styles.text}>© Global Fishing Watch {new Date().getFullYear()}</span>
    </footer>
  )
}

export default Footer
