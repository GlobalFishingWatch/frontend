import { useTranslation } from 'react-i18next'

import UserLoggedIconButton from 'features/user/UserLoggedIconButton'

const VesselIdentityFieldLogin = () => {
  const { t } = useTranslation()
  return (
    <UserLoggedIconButton
      icon="private"
      loginTooltip={t(
        'vessel.infoLogin',
        'Register and login to see more details (free, 2 minutes)'
      )}
      tooltipPlacement="bottom"
      size="small"
    />
  )
}

export default VesselIdentityFieldLogin
