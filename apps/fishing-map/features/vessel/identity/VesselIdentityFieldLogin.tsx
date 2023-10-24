import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import LocalStorageLoginLink from 'routes/LoginLink'

const VesselIdentityFieldLogin = () => {
  const { t } = useTranslation()
  const [isLoginHover, setIsLoginHover] = useState(false)
  return (
    <LocalStorageLoginLink>
      <IconButton
        icon={isLoginHover ? 'user' : 'private'}
        tooltip={
          t(
            'vessel.infoLogin',
            'Register and login to see more details (free, 2 minutes)'
          ) as string
        }
        tooltipPlacement="bottom"
        onMouseEnter={() => setIsLoginHover(true)}
        onMouseLeave={() => setIsLoginHover(false)}
        size="small"
      />
    </LocalStorageLoginLink>
  )
}

export default VesselIdentityFieldLogin
