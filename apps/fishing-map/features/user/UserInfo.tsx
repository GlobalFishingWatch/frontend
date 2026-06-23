import { Fragment, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import { Modal, Spinner, Tooltip } from '@globalfishingwatch/ui-components'

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
import { getModalParent } from 'features/modals/modals.utils'
import LogoutButton from 'features/user/LogoutButton'
import {
  selectIsGFWUser,
  selectUserData,
  selectUserLogged,
} from 'features/user/selectors/user.selectors'

import {
  selectHasAmbassadorBadge,
  selectHasFeedbackProviderBadge,
  selectHasImpactReporterBadge,
  selectHasPresenterBadge,
  selectHasTeacherBadge,
  selectUserGroupsClean,
} from './selectors/user.permissions.selectors'

import styles from './User.module.css'

type Badge = 'ambassador' | 'fixer' | 'presenter' | 'teacher' | 'impactReporter'
type BadgeInfo = { image: string; placeholder: string; userHasIt: boolean }

function UserInfo() {
  const { t } = useTranslation()
  const userLogged = useSelector(selectUserLogged)
  const isGFWUser = useSelector(selectIsGFWUser)
  const userData = useSelector(selectUserData)
  const userGroups = useSelector(selectUserGroupsClean)
  const hasAmbassadorBadge = useSelector(selectHasAmbassadorBadge)
  const hasFeedbackProviderBadge = useSelector(selectHasFeedbackProviderBadge)
  const hasPresenterBadge = useSelector(selectHasPresenterBadge)
  const hasTeacherBadge = useSelector(selectHasTeacherBadge)
  const hasImpactReporterBadge = useSelector(selectHasImpactReporterBadge)
  const [badgeSelected, setBadgeSelected] = useState<Badge>()

  const badgesModalOpen = badgeSelected !== undefined

  const onBadgeClick = (badge: Badge) => {
    setBadgeSelected(badge)
  }
  const onBadgeModalClose = () => {
    setBadgeSelected(undefined)
  }

  const BADGES: Record<Badge, BadgeInfo> = useMemo(
    () => ({
      presenter: {
        image: presenterImg,
        placeholder: presenterPlaceholderImg,
        userHasIt: hasPresenterBadge,
      },
      teacher: {
        image: teacherImg,
        placeholder: teacherPlaceholderImg,
        userHasIt: hasTeacherBadge,
      },
      fixer: {
        image: fixerImg,
        placeholder: fixerPlaceholderImg,
        userHasIt: hasFeedbackProviderBadge,
      },
      ambassador: {
        image: ambassadorImg,
        placeholder: ambassadorPlaceholderImg,
        userHasIt: hasAmbassadorBadge,
      },
      impactReporter: {
        image: impactReporterImg,
        placeholder: impactReporterPlaceholderImg,
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
    <div>
      <div className={styles.views}>
        <div className={styles.viewsHeader}>
          <div>
            <p>{`${userData.firstName} ${userData.lastName || ''}`}</p>
            <p className={styles.secondary}>{userData.email}</p>
          </div>
          <LogoutButton />
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
              parentSelector={getModalParent}
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
