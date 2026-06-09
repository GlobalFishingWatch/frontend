import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { IconButtonProps } from '@globalfishingwatch/ui-components'
import { IconButton } from '@globalfishingwatch/ui-components'

import { selectIsGuestUser, selectIsUserExpired } from 'features/user/selectors/user.selectors'
import LocalStorageLoginLink from 'router/LoginLink'

import styles from './User.module.css'

type UserLoggedIconButton = IconButtonProps & {
  loginTooltip?: string
  disabled?: boolean
  // Needed to avoid react warnings when cloning the component and used in a parent
  onToggleClick?: () => void
  testId?: string
  className?: string
}

const UserLoggedIconButton = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onToggleClick,
  loginTooltip,
  testId,
  className,
  ...props
}: UserLoggedIconButton) => {
  const { t } = useTranslation()
  const [isLoginHover, setIsLoginHover] = useState(false)
  const guestUser = useSelector(selectIsGuestUser)
  const isUserExpired = useSelector(selectIsUserExpired)

  if (guestUser || isUserExpired) {
    return (
      <LocalStorageLoginLink className={styles.loginLinkButton}>
        <IconButton
          {...props}
          testId={testId}
          icon={isLoginHover ? 'user' : props.icon}
          disabled={props.disabled}
          tooltip={loginTooltip || t((t) => t.vessel.infoLogin)}
          onClick={undefined}
          onMouseEnter={() => setIsLoginHover(true)}
          onMouseLeave={() => setIsLoginHover(false)}
          className={cx('print-hidden', className)}
        />
      </LocalStorageLoginLink>
    )
  }
  return <IconButton {...props} testId={testId} className={cx('print-hidden', className)} />
}

export default UserLoggedIconButton
