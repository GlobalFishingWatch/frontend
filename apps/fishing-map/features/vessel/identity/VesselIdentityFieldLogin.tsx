import { useTranslation } from 'react-i18next'

import UserLoggedIconButton from 'features/user/UserLoggedIconButton'

const VesselIdentityFieldLogin = () => {
  const { t } = useTranslation()
  return (
    <UserLoggedIconButton
      icon="private"
      loginTooltip={t('vessel.infoLogin')}
      tooltipPlacement="bottom"
      size="small"
    />
  )
}

export default VesselIdentityFieldLogin
