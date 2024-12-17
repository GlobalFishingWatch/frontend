/* eslint-disable @next/next/no-img-element */
import { Fragment, useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import { Button, Modal, Spinner, Tooltip } from '@globalfishingwatch/ui-components'
import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { ROOT_DOM_ELEMENT, SUPPORT_EMAIL } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectIsGFWUser,
  selectIsUserLogged,
  selectUserData,
} from 'features/user/selectors/user.selectors'
import ambassadorImg from 'assets/images/badges/ambassador.webp'
import ambassadorPlaceholderImg from 'assets/images/badges/ambassador-placeholder.webp'
import fixerImg from 'assets/images/badges/fixer.webp'
import fixerPlaceholderImg from 'assets/images/badges/fixer-placeholder.webp'
import presenterImg from 'assets/images/badges/presenter.webp'
import presenterPlaceholderImg from 'assets/images/badges/presenter-placeholder.webp'
import teacherImg from 'assets/images/badges/teacher.webp'
import teacherPlaceholderImg from 'assets/images/badges/teacher-placeholder.webp'
import { fetchUserThunk, logoutUserThunk } from './user.slice'
import styles from './User.module.css'
import {
  selectHasTeacherBadge,
  selectHasFeedbackProviderBadge,
  selectHasPresenterBadge,
  selectUserGroupsClean,
  selectHasAmbassadorBadge,
} from './selectors/user.permissions.selectors'

// t('user.badgeAmbassador', 'Ambassador')
// t('user.badgeFixer', 'Fixer')
// t('user.badgePresenter', 'Presenter')
// t('user.badgeTeacher', 'Teacher')
type Badge = 'Ambassador' | 'Fixer' | 'Presenter' | 'Teacher'
type BadgeInfo = { image: string; placeholder: string; userHasIt: boolean }

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
  const [badgeSelected, setBadgeSelected] = useState<Badge>()

  const badgesModalOpen = badgeSelected !== undefined

  const onLogoutClick = useCallback(async () => {
    setLogoutLoading(true)
    await dispatch(logoutUserThunk({ loginRedirect: false }))
    dispatch(updateLocation(HOME, { query: {}, replaceQuery: true }))
    await dispatch(fetchUserThunk({ guest: true }))
    setLogoutLoading(false)
  }, [dispatch])

  const onBadgeClick = (badge: Badge) => {
    setBadgeSelected(badge)
  }
  const onBadgeModalClose = () => {
    setBadgeSelected(undefined)
  }

  const BADGES: Record<Badge, BadgeInfo> = useMemo(
    () => ({
      Ambassador: {
        image: ambassadorImg.src,
        placeholder: ambassadorPlaceholderImg.src,
        userHasIt: hasAmbassadorBadge,
      },
      Fixer: {
        image: fixerImg.src,
        placeholder: fixerPlaceholderImg.src,
        userHasIt: hasFeedbackProviderBadge,
      },
      Presenter: {
        image: presenterImg.src,
        placeholder: presenterPlaceholderImg.src,
        userHasIt: hasPresenterBadge,
      },
      Teacher: {
        image: teacherImg.src,
        placeholder: teacherPlaceholderImg.src,
        userHasIt: hasTeacherBadge,
      },
    }),
    [hasAmbassadorBadge, hasFeedbackProviderBadge, hasPresenterBadge, hasTeacherBadge]
  )

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
          <Fragment>
            <div className={styles.row}>
              <label>{t('user.gfwBadges', 'GFW Badges')}</label>
              <ul className={styles.badges}>
                {Object.entries(BADGES).map((entry) => {
                  const [badgeKey, badgeInfo] = entry as [Badge, BadgeInfo]
                  return (
                    <li className={styles.badge}>
                      <Tooltip content={t('common.seeMore', 'See more')}>
                        {badgeInfo.userHasIt ? (
                          <button
                            onClick={badgeInfo.userHasIt ? () => onBadgeClick(badgeKey) : undefined}
                          >
                            <img src={BADGES[badgeKey].image} alt="" />
                          </button>
                        ) : (
                          <img src={BADGES[badgeKey].placeholder} alt="" />
                        )}
                      </Tooltip>
                    </li>
                  )
                })}
              </ul>
            </div>
            <Modal
              appSelector={ROOT_DOM_ELEMENT}
              isOpen={badgesModalOpen}
              onClose={onBadgeModalClose}
              contentClassName={styles.badgeModalContent}
              shouldCloseOnEsc
            >
              <Fragment>
                {badgeSelected && <img src={BADGES[badgeSelected].image} alt="" />}
                {badgeSelected && <span>{t(`user.badge${badgeSelected}`, badgeSelected)}</span>}
              </Fragment>
            </Modal>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default UserInfo
