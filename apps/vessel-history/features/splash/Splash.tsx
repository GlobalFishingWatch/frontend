import React, { Fragment, memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { redirect } from 'redux-first-router'

import { useNavigatorOnline } from '@globalfishingwatch/react-hooks'
import { Button } from '@globalfishingwatch/ui-components'

import Partners from 'features/partners/Partners'
import { useUser } from 'features/user/user.hooks'
import { HOME } from 'routes/routes'
import { useLoginRedirect } from 'routes/routes.hook'

import vesselHistoryLogo from '../../assets/images/splash-screen-image@2x.png'

import styles from './Splash.module.css'

const Splash: React.FC<{ intro?: boolean }> = ({ intro }) => {
  const { t, i18n } = useTranslation()
  const { loading, logout, user, authorized } = useUser()
  const { onLoginClick } = useLoginRedirect()
  const dispatch = useDispatch()
  const { online } = useNavigatorOnline()

  const requestAccess = useCallback(() => {
    window.location.href =
      'mailto:support@globalfishingwatch.org?subject=Requesting access to Vessel Viewer App'
  }, [])

  const goToOfflineHome = useCallback(() => {
    dispatch(
      redirect({
        type: HOME,
        query: {
          offline: 'true',
        },
      }) as any
    )
  }, [dispatch])

  return (
    <div className={styles.container} data-testid="splash">
      <div className={styles.splash}>
        <img src={vesselHistoryLogo.src} className={styles.vhLogo} alt="Vessel History" />
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
            <div className={styles.deprecationWarning}>
              {/* {t(
                'user.notLoggedIn',
                'Only some specific registered users can use this product. Please log in with your Global Fishing Watch credentials'
              )} */}
              {i18n.language === 'fr' ? (
                <Fragment>
                  <p>
                    Bienvenue ! Ceci est la version prototype privée de Vessel Viewer, qui sera
                    progressivement abandonnée à la fin de l'année 2025, alors que nous concentrons
                    nos efforts sur l’amélioration de la{' '}
                    <a href="https://globalfishingwatch.org/map/vessel-search?lng=fr">
                      plateforme publique de Vessel Viewer.
                    </a>
                  </p>
                  <p>
                    This prototype currently contains more vessels than the public Vessel Viewer
                    version, however part of the data it contains is no longer updated since 24
                    January 2025. Therefore, we recommend only using this prototype version in
                    parallel to the public version, to ensure you can access vessels not visible on
                    the public version, and can still access up-to-date vessel identity information.
                  </p>
                  <p>
                    Please log in with your Global Fishing Watch credentials. If you experience any
                    issue or require support using Vessel Viewer, please{' '}
                    <a
                      href="mailto:support@globalfishingwatch.org?subject=Vessel Viewer prototype issues"
                      className={styles.link}
                    >
                      email us
                    </a>
                    .
                  </p>
                </Fragment>
              ) : (
                <Fragment>
                  <p>
                    Welcome! This is the private prototype version of Vessel Viewer that is being
                    phased out in late 2025, as we focus improvements on the{' '}
                    <a href="https://globalfishingwatch.org/map/vessel-search">
                      public Vessel Viewer platform.
                    </a>
                  </p>
                  <p>
                    This prototype currently contains more vessels than the public Vessel Viewer
                    version, however part of the data it contains is no longer updated since 24
                    January 2025. Therefore, we recommend only using this prototype version in
                    parallel to the public version, to ensure you can access vessels not visible on
                    the public version, and can still access up-to-date vessel identity information.
                  </p>
                  <p>
                    Please log in with your Global Fishing Watch credentials. If you experience any
                    issue or require support using Vessel Viewer, please{' '}
                    <a
                      href="mailto:support@globalfishingwatch.org?subject=Vessel Viewer prototype issues"
                      className={styles.link}
                    >
                      email us
                    </a>
                    .
                  </p>
                </Fragment>
              )}
            </div>
            <div className={styles.buttons}>
              <Button onClick={onLoginClick}>{t('user.login', 'Log in')}</Button>
            </div>
            {!online && (
              <span className={styles.offlineLink} onClick={() => goToOfflineHome()}>
                continue offline
              </span>
            )}
          </div>
        )}
      </div>
      <Partners />
    </div>
  )
}
export default memo(Splash)
