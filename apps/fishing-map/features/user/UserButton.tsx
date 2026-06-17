import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'
import cx from 'classnames'

import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import { Icon, IconButton, Spinner, Tooltip } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_LIST_VIEWPORT } from 'data/config'
import LoginLink from 'features/user/LoginLink'
import {
  selectIsGuestUser,
  selectIsUserExpired,
  selectUserData,
  selectUserStatus,
} from 'features/user/selectors/user.selectors'
import { selectWorkspaceCustomStatus } from 'features/workspace/workspace.selectors'
import { selectIsUserLocation } from 'router/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './UserButton.module.css'

const UserButton = ({ className = '', testId }: { className?: string; testId?: string }) => {
  const { t } = useTranslation()
  const guestUser = useSelector(selectIsGuestUser)
  const isUserLocation = useSelector(selectIsUserLocation)
  const isUserExpired = useSelector(selectIsUserExpired)
  const userData = useSelector(selectUserData)
  const userStatus = useSelector(selectUserStatus)
  const customStatus = useSelector(selectWorkspaceCustomStatus)
  const isSmallScreen = useSmallScreen()
  const prevStatusRef = useRef(customStatus)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (
      !isSmallScreen &&
      prevStatusRef.current === AsyncReducerStatus.Loading &&
      customStatus === AsyncReducerStatus.Finished
    ) {
      setIsAnimating(true)
    }
    prevStatusRef.current = customStatus
  }, [customStatus, isSmallScreen])

  const initials = userData?.firstName
    ? `${userData?.firstName?.slice(0, 1)}${userData?.lastName?.slice(0, 1)}`
    : ''

  if (userStatus !== AsyncReducerStatus.Finished) {
    return (
      <div className={cx(className, styles.wrapper)}>
        <Spinner size="tiny" />
      </div>
    )
  }

  return (
    <div className={cx(className, styles.wrapper)}>
      {guestUser || isUserExpired ? (
        <LoginLink
          tooltip={t((t) => t.common.login)}
          className={styles.loginLinkButton}
          loginSource="user-icon"
        >
          <Icon icon="user" testId={testId} />
        </LoginLink>
      ) : (
        <Tooltip
          content={
            isUserLocation ? undefined : (
              <div>
                {userData?.email && <p>{userData.email}</p>}
                <p className={styles.secondary}>{t((t) => t.user.profileTooltip)}</p>
              </div>
            )
          }
        >
          <Link
            to="/user"
            search={{ ...DEFAULT_WORKSPACE_LIST_VIEWPORT }}
            replace
            data-testid={testId}
            className={cx(styles.wrapper, { [styles.openFileAnimation]: isAnimating })}
          >
            {userData ? initials : <Icon icon="user" className="print-hidden" />}
          </Link>
        </Tooltip>
      )}
      <span
        aria-hidden
        className={cx(styles.saveIcon, { [styles.animating]: isAnimating })}
        onAnimationEnd={() => setIsAnimating(false)}
      >
        <IconButton icon="workspace" type="map-tool" />
      </span>
    </div>
  )
}

export default UserButton
