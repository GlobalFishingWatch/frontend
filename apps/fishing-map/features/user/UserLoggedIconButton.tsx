import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import type { IconButtonProps } from '@globalfishingwatch/ui-components';
import { IconButton } from '@globalfishingwatch/ui-components'
import LocalStorageLoginLink from 'routes/LoginLink'
import { selectIsGuestUser, selectIsUserExpired } from 'features/user/selectors/user.selectors'

type UserLoggedIconButton = IconButtonProps & {
  loginTooltip?: string
  onAddToVesselGroup?: (vesselGroupId: string) => void
  keepOpenWhileAdding?: boolean
  onToggleClick?: () => void
}

const UserLoggedIconButton = ({
  loginTooltip,
  onAddToVesselGroup,
  onToggleClick,
  keepOpenWhileAdding,
  ...props
}: UserLoggedIconButton) => {
  const { t } = useTranslation()
  const [isLoginHover, setIsLoginHover] = useState(false)
  const guestUser = useSelector(selectIsGuestUser)
  const isUserExpired = useSelector(selectIsUserExpired)

  if (guestUser || isUserExpired) {
    return (
      <LocalStorageLoginLink>
        <IconButton
          {...props}
          icon={isLoginHover ? 'user' : props.icon}
          tooltip={
            loginTooltip ||
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
