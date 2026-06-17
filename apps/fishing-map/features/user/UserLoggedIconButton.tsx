import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { IconButtonProps } from '@globalfishingwatch/ui-components'
import { IconButton } from '@globalfishingwatch/ui-components'

import LoginLink from 'features/user/LoginLink'
import { selectIsGuestUser, selectIsUserExpired } from 'features/user/selectors/user.selectors'
import type { LoginSource } from 'features/user/user.types'

import styles from './User.module.css'

type UserLoggedIconButton = IconButtonProps & {
  loginTooltip?: string
  disabled?: boolean
  // Needed to avoid react warnings when cloning the component and used in a parent
  onToggleClick?: () => void
  testId?: string
  className?: string
  loginSource?: LoginSource
}

const UserLoggedIconButton = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onToggleClick,
  loginTooltip,
  testId,
  className,
  loginSource,
  ...props
}: UserLoggedIconButton) => {
  const { t } = useTranslation()
  const [isLoginHover, setIsLoginHover] = useState(false)
  const guestUser = useSelector(selectIsGuestUser)
  const isUserExpired = useSelector(selectIsUserExpired)

  if (guestUser || isUserExpired) {
    return (
      <LoginLink className={styles.loginLinkButton} loginSource={loginSource}>
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
      </LoginLink>
    )
  }
  return <IconButton {...props} testId={testId} className={cx('print-hidden', className)} />
}

export default UserLoggedIconButton
