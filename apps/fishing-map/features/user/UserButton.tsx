import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import Link from 'redux-first-router-link'

import { Icon, IconButton, Tooltip } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_LIST_VIEWPORT } from 'data/config'
import {
  selectIsGuestUser,
  selectIsUserExpired,
  selectUserData,
} from 'features/user/selectors/user.selectors'
import { selectWorkspaceCustomStatus } from 'features/workspace/workspace.selectors'
import LocalStorageLoginLink from 'routes/LoginLink'
import { USER } from 'routes/routes'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './UserButton.module.css'

const UserButton = ({ className = '', testId }: { className?: string; testId?: string }) => {
  const { t } = useTranslation()
  const guestUser = useSelector(selectIsGuestUser)
  const isUserExpired = useSelector(selectIsUserExpired)
  const userData = useSelector(selectUserData)
  const customStatus = useSelector(selectWorkspaceCustomStatus)
  const prevStatusRef = useRef(customStatus)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (
      prevStatusRef.current === AsyncReducerStatus.Loading &&
      customStatus === AsyncReducerStatus.Finished
    ) {
      setIsAnimating(true)
    }
    prevStatusRef.current = customStatus
  }, [customStatus])

  const initials = userData?.firstName
    ? `${userData?.firstName?.slice(0, 1)}${userData?.lastName?.slice(0, 1)}`
    : ''
  return (
    <>
      <div className={cx(className, styles.wrapper)}>
        {guestUser || isUserExpired ? (
          <Tooltip content={t((t) => t.common.login)}>
            <LocalStorageLoginLink>
              <Icon icon="user" testId={testId} />
            </LocalStorageLoginLink>
          </Tooltip>
        ) : (
          <Link
            to={{
              type: USER,
              payload: {},
              query: { ...DEFAULT_WORKSPACE_LIST_VIEWPORT },
              replaceQuery: true,
            }}
            data-testid={testId}
            className={cx(styles.wrapper, { [styles.openFileAnimation]: isAnimating })}
          >
            {userData ? initials : <Icon icon="user" className="print-hidden" />}
          </Link>
        )}
        <span
          aria-hidden
          className={cx(styles.saveIcon, { [styles.animating]: isAnimating })}
          onAnimationEnd={() => setIsAnimating(false)}
        >
          <span className={styles.saveBadge}>
            <IconButton icon="save" type="map-tool" />
          </span>
        </span>
      </div>
    </>
  )
}

export default UserButton
