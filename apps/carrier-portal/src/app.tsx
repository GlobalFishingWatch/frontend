import React, { lazy, Suspense, Fragment, useState, useEffect } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import Modal from 'react-modal'
import styles from 'app.module.css'
import { LOGIN } from 'routes'
import Header from 'components/header/header.container'
import Menu from 'components/menu/menu'
import Loader from 'components/loader/loader'
import { useAnalytics } from 'app/analytics.hooks'
import WelcomeModal from 'components/welcome/welcome'
import { getLocationType } from 'redux-modules/router/route.selectors'
import { getUserData } from 'redux-modules/user/user.selectors'
import LoginComponent from './pages/login/login'

declare global {
  interface Window {
    gtag: any
  }
}

Modal.setAppElement('#root')
const GOOGLE_TAG_MEASUREMENT_ID = process.env.REACT_APP_GOOGLE_TAG_MEASUREMENT_ID
const HomePageComponent = lazy(() => import(`./pages/home/home.container`))

const App: React.FC = (): React.ReactElement => {
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const userData = useSelector(getUserData)
  const locationType = useSelector(getLocationType)
  useAnalytics()
  useEffect(() => {
    if (userData && GOOGLE_TAG_MEASUREMENT_ID && window.gtag) {
      window.gtag('config', GOOGLE_TAG_MEASUREMENT_ID, {
        user_id: userData.id,
        custom_map: {
          dimension1: 'userId',
          dimension3: 'userGroup',
          dimension4: 'userOrgType',
          dimension5: 'userOrganization',
          dimension6: 'userCountry',
          dimension7: 'userLanguage',
        },
      })
      window.gtag('event', 'login', {
        userId: userData.id,
        userGroup: userData.groups,
        userOrgType: userData.organizationType,
        userOrganization: userData.organization,
        userCountry: userData.country,
        userLanguage: userData.language,
      })
    }
  }, [userData])

  if (locationType === LOGIN) return <LoginComponent />

  return (
    <Fragment>
      <Header showMenu={setShowMenu} />
      <nav className={cx(styles.menuWrapper, { [styles.hidden]: !showMenu })}>
        <Menu onCloseClick={() => setShowMenu(false)} />
        <div className={cx('veil', styles.menuVeil)} onClick={() => setShowMenu(false)} />
      </nav>
      <Suspense fallback={<Loader />}>
        <HomePageComponent />
      </Suspense>
      <WelcomeModal />
    </Fragment>
  )
}

export default App
