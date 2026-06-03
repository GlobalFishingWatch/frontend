import { useSelector } from 'react-redux'

import { getLoginUrl, useLoginRedirect } from '@globalfishingwatch/react-hooks'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectWorkspaceHistoryNavigation } from 'features/workspace/workspace.selectors'
import { setWorkspaceSuggestSave } from 'features/workspace/workspace.slice'

export function usePopupLogin() {
  const dispatch = useAppDispatch()
  const { saveRedirectUrl, saveHistoryNavigation } = useLoginRedirect()
  const workspaceHistoryNavigation = useSelector(selectWorkspaceHistoryNavigation)

  return (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    dispatch(setWorkspaceSuggestSave(false))
    saveRedirectUrl()
    saveHistoryNavigation(workspaceHistoryNavigation)

    const width = 500
    const height = 750
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    // This works because we have useLoginMessage hook initialized in the app listening to messages
    window.open(
      getLoginUrl(undefined, { isPopup: 'true' }),
      'SSO Login',
      `width=${width},height=${height},left=${left},top=${top}`
    )
  }
}
