import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import { Button } from '@globalfishingwatch/ui-components/dist'
import { useUser } from 'features/user/user.hooks'
import vesselHistoryLogo from '../../assets/images/splash-screen-image@2x.png'
import tmtLogo from '../../assets/images/tmt_logo_final_full_colour@2x.png'
import styles from './Splash.module.css'

const Splash: React.FC<{ intro?: boolean }> = ({ intro }) => {
  const { t } = useTranslation()
  const { loading, login, logout, user, authorized } = useUser()

  const requestAccess = useCallback(() => {
    window.location.href =
      'mailto:support@globalfishingwatch.org?subject=Requesting access to Vessel Viewer App'
  }, [])

  return (
    <div className={styles.container} data-testid="splash">
      <div className={styles.splash}>
        <img src={vesselHistoryLogo} className={styles.vhLogo} alt="Vessel History" />
        {!intro && user && !authorized && (
          <div>
            {t('user.notAuthorized', 'Only some specific registered users can use this product')} (
            {t('user.loggedInAs', 'logged in as')}:{' '}
            <strong className={styles.user}>{user.email}</strong>).
            <div className={styles.buttons}>
              <Button onClick={requestAccess}>{t('user.requestAccess', 'Request access')}</Button>
              <Button type="secondary" onClick={logout}>
                {t('user.switchAccount', 'Switch account')}
              </Button>
            </div>
          </div>
        )}
        {!intro && !loading && !user && (
          <div>
            <div>
              {t(
                'user.notLoggedIn',
                'Only some specific registered users can use this product. Please log in with your Global Fishing Watch credentials'
              )}
            </div>
            <div className={styles.buttons}>
              <Button onClick={login}>{t('user.login', 'Log in')}</Button>
            </div>
          </div>
        )}
      </div>
      <div className={styles.secondary}>
        <img src={tmtLogo} className={styles.tmtLogo} alt="Trygg Mat Tracking" />
        <Logo className={styles.gfwLogo} />
      </div>
    </div>
  )
}
export default memo(Splash)
