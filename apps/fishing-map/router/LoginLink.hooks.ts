import { GFWAPI } from '@globalfishingwatch/api-client'

import { useAppDispatch } from 'features/app/app.hooks'
import { setWorkspaceSuggestSave } from 'features/workspace/workspace.slice'

export function usePopupLogin() {
  const dispatch = useAppDispatch()

  return (e?: React.MouseEvent) => {
    if (typeof window === 'undefined') {
      return
    }
    e?.preventDefault()
    e?.stopPropagation()
    dispatch(setWorkspaceSuggestSave(false))
    const params = new URLSearchParams({ isPopup: 'true', hideHeader: 'true' })

    const { origin, pathname } = window.location
    const loginUrl = GFWAPI.getLoginUrl(`${origin}${pathname}?${params.toString()}`, {
      hideHeader: true,
    })

    const width = 500
    const height = 750
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    // This works because we have useLoginMessage hook initialized in the app listening to messages
    window.open(loginUrl, 'SSO Login', `width=${width},height=${height},left=${left},top=${top}`)
  }
}
