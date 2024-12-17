import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import { Button, Spinner, Tooltip } from '@globalfishingwatch/ui-components'
import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { SUPPORT_EMAIL } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectIsGFWUser,
  selectIsUserLogged,
  selectUserData,
} from 'features/user/selectors/user.selectors'
import ambassorImg from 'assets/images/badges/ambassor.jpg'
import feedbackImg from 'assets/images/badges/feedback.jpg'
import presenterImg from 'assets/images/badges/presenter.jpg'
import teacherImg from 'assets/images/badges/teacher.jpg'
import { fetchUserThunk, logoutUserThunk } from './user.slice'
import styles from './User.module.css'
import {
  selectHasTeacherBadge,
  selectHasFeedbackProviderBadge,
  selectHasPresenterBadge,
  selectUserGroupsClean,
  selectHasAmbassadorBadge,
} from './selectors/user.permissions.selectors'

function UserInfo() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const userLogged = useSelector(selectIsUserLogged)
  const isGFWUser = useSelector(selectIsGFWUser)
  const userData = useSelector(selectUserData)
  const userGroups = useSelector(selectUserGroupsClean)
  const hasAmbassadorBadge = useSelector(selectHasAmbassadorBadge)
  const hasFeedbackProviderBadge = useSelector(selectHasFeedbackProviderBadge)
  const hasPresenterBadge = useSelector(selectHasPresenterBadge)
  const hasTeacherBadge = useSelector(selectHasTeacherBadge)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const onLogoutClick = useCallback(async () => {
    setLogoutLoading(true)
    await dispatch(logoutUserThunk({ loginRedirect: false }))
    dispatch(updateLocation(HOME, { query: {}, replaceQuery: true }))
    await dispatch(fetchUserThunk({ guest: true }))
    setLogoutLoading(false)
  }, [dispatch])

  if (!userLogged || !userData) return null

  if (!userLogged || !userData || userData?.type === GUEST_USER_TYPE) {
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    )
  }

  return (
    <div className={styles.userInfo}>
      <div className={styles.views}>
        <div className={styles.viewsHeader}>
          <div>
            <p>{`${userData.firstName} ${userData.lastName || ''}`}</p>
            <p className={styles.secondary}>{userData.email}</p>
          </div>
          <Button
            type="secondary"
            loading={logoutLoading}
            disabled={logoutLoading}
            onClick={onLogoutClick}
          >
            <span>{t('common.logout', 'Log out')}</span>
          </Button>
        </div>
        <label>{t('user.groups', 'User Groups')}</label>
        {userGroups && <p className={styles.textSpaced}>{userGroups.join(', ')}</p>}
        <p className={styles.missingGroup}>
          <Trans i18nKey="user.groupMissing">
            Do you belong to a user group that doesn’t appear here?{' '}
            <a
              className={styles.link}
              href={`mailto:${SUPPORT_EMAIL}?subject=Requesting access in user group`}
            >
              Request access
            </a>
          </Trans>
        </p>
        {isGFWUser && (
          <div className={styles.row}>
            <label>{t('user.badges', 'Badges')}</label>
            <ul className={styles.badges}>
              <Tooltip
                content={
                  hasPresenterBadge ? t('user.badgePresenter', 'Shows people our products') : 'TODO'
                }
              >
                <li className={styles.badge}>
                  {hasPresenterBadge ? (
                    <img src={presenterImg.src} alt="Presenter badge" />
                  ) : (
                    'presenter placeholder'
                  )}
                </li>
              </Tooltip>
              <Tooltip
                content={
                  hasTeacherBadge ? t('user.badgeTeacher', 'Shows people our products') : 'TODO'
                }
              >
                <li className={styles.badge}>
                  {hasTeacherBadge ? (
                    <img src={teacherImg.src} alt="Teacher badge" />
                  ) : (
                    'teacher placeholder'
                  )}
                </li>
              </Tooltip>
              <Tooltip
                content={
                  hasFeedbackProviderBadge
                    ? t('user.badgePresenter', 'Improves our products/guide')
                    : 'TODO'
                }
              >
                <li className={styles.badge}>
                  {hasFeedbackProviderBadge ? (
                    <img src={feedbackImg.src} alt="Feedback badge" />
                  ) : (
                    'teacher placeholder'
                  )}
                </li>
              </Tooltip>
              <Tooltip
                content={
                  hasAmbassadorBadge
                    ? t(
                        'user.badgePresenter',
                        'Demonstrates value of our products OR connects our products to real-world situations'
                      )
                    : 'TODO'
                }
              >
                <li className={styles.badge}>
                  {hasAmbassadorBadge ? (
                    <img src={ambassorImg.src} alt="Ambassador badge" />
                  ) : (
                    'teacher placeholder'
                  )}
                </li>
              </Tooltip>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserInfo
