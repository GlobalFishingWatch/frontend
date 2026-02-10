/* eslint-disable @next/next/no-img-element */
import { Fragment, useCallback, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useRouter } from '@tanstack/react-router'

import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import { Button, Modal, Spinner, Tooltip } from '@globalfishingwatch/ui-components'

import ambassadorImg from 'assets/images/badges/ambassador.webp'
import ambassadorPlaceholderImg from 'assets/images/badges/ambassador-placeholder.webp'
import fixerImg from 'assets/images/badges/fixer.webp'
import fixerPlaceholderImg from 'assets/images/badges/fixer-placeholder.webp'
import impactReporterImg from 'assets/images/badges/impact-reporter.webp'
import impactReporterPlaceholderImg from 'assets/images/badges/impact-reporter-placeholder.webp'
import presenterImg from 'assets/images/badges/presenter.webp'
import presenterPlaceholderImg from 'assets/images/badges/presenter-placeholder.webp'
import teacherImg from 'assets/images/badges/teacher.webp'
import teacherPlaceholderImg from 'assets/images/badges/teacher-placeholder.webp'
import { ROOT_DOM_ELEMENT, SUPPORT_EMAIL } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectIsGFWUser,
  selectIsUserLogged,
  selectUserData,
} from 'features/user/selectors/user.selectors'
import { ROUTE_PATHS } from 'routes/routes.utils'

import {
  selectHasAmbassadorBadge,
  selectHasFeedbackProviderBadge,
  selectHasImpactReporterBadge,
  selectHasPresenterBadge,
  selectHasTeacherBadge,
  selectUserGroupsClean,
} from './selectors/user.permissions.selectors'
import { fetchUserThunk, logoutUserThunk } from './user.slice'

import styles from './User.module.css'

type Badge = 'ambassador' | 'fixer' | 'presenter' | 'teacher' | 'impactReporter'
type BadgeInfo = { image: string; placeholder: string; userHasIt: boolean }

function UserInfo() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const userLogged = useSelector(selectIsUserLogged)
  const isGFWUser = useSelector(selectIsGFWUser)
  const userData = useSelector(selectUserData)
  const userGroups = useSelector(selectUserGroupsClean)
  const hasAmbassadorBadge = useSelector(selectHasAmbassadorBadge)
  const hasFeedbackProviderBadge = useSelector(selectHasFeedbackProviderBadge)
  const hasPresenterBadge = useSelector(selectHasPresenterBadge)
  const hasTeacherBadge = useSelector(selectHasTeacherBadge)
  const hasImpactReporterBadge = useSelector(selectHasImpactReporterBadge)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [badgeSelected, setBadgeSelected] = useState<Badge>()

  const badgesModalOpen = badgeSelected !== undefined

  const onLogoutClick = useCallback(async () => {
    setLogoutLoading(true)
    await dispatch(logoutUserThunk({ loginRedirect: false }))
    router.navigate({ to: ROUTE_PATHS.HOME, search: {}, replace: true })
    await dispatch(fetchUserThunk({ guest: true }))
    setLogoutLoading(false)
  }, [dispatch, router])

  const onBadgeClick = (badge: Badge) => {
    setBadgeSelected(badge)
  }
  const onBadgeModalClose = () => {
    setBadgeSelected(undefined)
  }

  const BADGES: Record<Badge, BadgeInfo> = useMemo(
    () => ({
      presenter: {
        image: presenterImg.src,
        placeholder: presenterPlaceholderImg.src,
        userHasIt: hasPresenterBadge,
      },
      teacher: {
        image: teacherImg.src,
        placeholder: teacherPlaceholderImg.src,
        userHasIt: hasTeacherBadge,
      },
      fixer: {
        image: fixerImg.src,
        placeholder: fixerPlaceholderImg.src,
        userHasIt: hasFeedbackProviderBadge,
      },
      ambassador: {
        image: ambassadorImg.src,
        placeholder: ambassadorPlaceholderImg.src,
        userHasIt: hasAmbassadorBadge,
      },
      impactReporter: {
        image: impactReporterImg.src,
        placeholder: impactReporterPlaceholderImg.src,
        userHasIt: hasImpactReporterBadge,
      },
    }),
    [
      hasAmbassadorBadge,
      hasFeedbackProviderBadge,
      hasImpactReporterBadge,
      hasPresenterBadge,
      hasTeacherBadge,
    ]
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
            <span>{t((t) => t.common.logout)}</span>
          </Button>
        </div>
        <label>{t((t) => t.user.groups)}</label>
        {userGroups && <p className={styles.textSpaced}>{userGroups.join(', ')}</p>}
        <p className={styles.missingGroup}>
          <Trans i18nKey={(t) => t.user.groupMissing}>
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
              <label>{t((t) => t.user.gfwBadges)}</label>
              <ul className={styles.badges}>
                {Object.entries(BADGES).map((entry) => {
                  const [badgeKey, badgeInfo] = entry as [Badge, BadgeInfo]
                  return (
                    <li key={badgeKey} className={styles.badge}>
                      {badgeInfo.userHasIt ? (
                        <Tooltip content={t((t) => t.common.seeMore)}>
                          <button
                            onClick={badgeInfo.userHasIt ? () => onBadgeClick(badgeKey) : undefined}
                          >
                            <img src={BADGES[badgeKey].image} alt="" />
                          </button>
                        </Tooltip>
                      ) : (
                        <img src={BADGES[badgeKey].placeholder} alt="" />
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
            <Modal
              appSelector={ROOT_DOM_ELEMENT}
              isOpen={badgesModalOpen}
              title={t((t) => t.user.badges[badgeSelected!].title, {
                defaultValue: '',
              })}
              onClose={onBadgeModalClose}
              contentClassName={styles.badgeModalContent}
              shouldCloseOnEsc
            >
              <Fragment>
                {badgeSelected && <img src={BADGES[badgeSelected].image} alt="" />}
                <span>
                  {t((t) => t.user.badges[badgeSelected!].description, {
                    defaultValue: '',
                  })}
                </span>
              </Fragment>
            </Modal>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default UserInfo
