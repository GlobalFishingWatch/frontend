import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { Button, Icon } from '@globalfishingwatch/ui-components'

import { fetchUserThunk } from 'features/_user/user.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { getIsBrowser } from 'utils/dom'

const SETTINGS_UPDATED_MESSAGE = 'gfw:settings-updated'

function useRedirectToSettingsPage() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!getIsBrowser()) {
      return
    }
    const settingsOrigin = new URL(GFWAPI.getConfig().baseUrl).origin
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== settingsOrigin || event.data?.type !== SETTINGS_UPDATED_MESSAGE) {
        return
      }
      dispatch(fetchUserThunk())
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [dispatch])

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
