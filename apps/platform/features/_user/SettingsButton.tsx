import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { Button, Icon } from '@globalfishingwatch/ui-components'

import { getIsBrowser } from 'utils/dom'

function useRedirectToSettingsPage() {
  return useCallback((e?: React.MouseEvent) => {
    if (!getIsBrowser()) {
      return
    }
    e?.preventDefault()
    e?.stopPropagation()
    const settingsUrl = GFWAPI.getSettingsUrl(window.location.href)
    window.open(settingsUrl, '_blank')
  }, [])
}

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
