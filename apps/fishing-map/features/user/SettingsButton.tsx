import { useTranslation } from 'react-i18next'

import { Button, Icon } from '@globalfishingwatch/ui-components'

import { useRedirectToSettingsPage } from './user.hooks'

function SettingsButton() {
  const { t } = useTranslation()
  const redirectToSettingsPage = useRedirectToSettingsPage()

  return (
    <Button type="secondary" onClick={redirectToSettingsPage} testId="settings-button">
      <Icon icon="settings" />
      <span>{t((t) => t.common.settings)}</span>
    </Button>
  )
}

export default SettingsButton
