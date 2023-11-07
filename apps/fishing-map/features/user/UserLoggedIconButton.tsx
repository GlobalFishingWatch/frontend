import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { IconButton, IconButtonProps } from '@globalfishingwatch/ui-components'
import LocalStorageLoginLink from 'routes/LoginLink'
import { isGuestUser } from 'features/user/user.slice'

type UserLoggedIconButton = IconButtonProps & { loginTooltip?: string }

const UserLoggedIconButton = (props: UserLoggedIconButton) => {
  const { t } = useTranslation()
  const [isLoginHover, setIsLoginHover] = useState(false)
  const guestUser = useSelector(isGuestUser)

  if (guestUser) {
    return (
      <LocalStorageLoginLink>
        <IconButton
          {...props}
          icon={isLoginHover ? 'user' : props.icon}
          tooltip={
            props.loginTooltip ||
            t('vessel.infoLogin', 'Register and login to see more details (free, 2 minutes)')
          }
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
