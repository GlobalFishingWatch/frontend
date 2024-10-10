import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { IconButton, IconButtonProps } from '@globalfishingwatch/ui-components'
import LocalStorageLoginLink from 'routes/LoginLink'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'

type UserLoggedIconButton = IconButtonProps & {
  loginTooltip?: string
  onAddToVesselGroup?: (vesselGroupId: string) => void
  onToggleClick?: () => void
}

const UserLoggedIconButton = ({
  loginTooltip,
  onAddToVesselGroup,
  onToggleClick,
  ...props
}: UserLoggedIconButton) => {
  const { t } = useTranslation()
  const [isLoginHover, setIsLoginHover] = useState(false)
  const guestUser = useSelector(selectIsGuestUser)

  if (guestUser) {
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
