import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { IconButtonProps } from '@globalfishingwatch/ui-components'
import { IconButton } from '@globalfishingwatch/ui-components'

import { selectIsGuestUser, selectIsUserExpired } from 'features/user/selectors/user.selectors'
import LocalStorageLoginLink from 'routes/LoginLink'

import styles from './User.module.css'

type UserLoggedIconButton = IconButtonProps & {
  loginTooltip?: string
  disabled?: boolean
  // Needed to avoid react warnings when cloning the component and used in a parent
  onToggleClick?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserLoggedIconButton = ({ loginTooltip, onToggleClick, ...props }: UserLoggedIconButton) => {
  const { t } = useTranslation()
  const [isLoginHover, setIsLoginHover] = useState(false)
  const guestUser = useSelector(selectIsGuestUser)
  const isUserExpired = useSelector(selectIsUserExpired)

  if (guestUser || isUserExpired) {
    return (
      <LocalStorageLoginLink className={styles.loginLinkButton}>
        <IconButton
          {...props}
          icon={isLoginHover ? 'user' : props.icon}
          disabled={props.disabled}
          tooltip={loginTooltip || t('vessel.infoLogin')}
          onClick={undefined}
          onMouseEnter={() => setIsLoginHover(true)}
          onMouseLeave={() => setIsLoginHover(false)}
        />
      </LocalStorageLoginLink>
    )
  }
  return <IconButton {...props} />
}

export default UserLoggedIconButton
