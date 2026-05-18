import { forwardRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getLoginUrl, useLoginRedirect } from '@globalfishingwatch/react-hooks'

import { useAppDispatch } from 'features/app/app.hooks'
import { fetchUserThunk } from 'features/user/user.slice'
import { selectWorkspaceHistoryNavigation } from 'features/workspace/workspace.selectors'
import { setWorkspaceSuggestSave } from 'features/workspace/workspace.slice'

type LocalStorageLoginLinkProps = {
  children: React.ReactNode
  className?: string
}

function LocalStorageLoginLink({ children, className = '' }: LocalStorageLoginLinkProps, ref: any) {
  const { saveRedirectUrl, saveHistoryNavigation } = useLoginRedirect()
  const dispatch = useAppDispatch()
  const workspaceHistoryNavigation = useSelector(selectWorkspaceHistoryNavigation)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'LOGIN_SUCCESS') {
        dispatch(fetchUserThunk({ accessToken: event.data.accessToken }))
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [dispatch])

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(setWorkspaceSuggestSave(false))
    saveRedirectUrl()
    saveHistoryNavigation(workspaceHistoryNavigation)

    const width = 500
    const height = 750
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    window.open(
      getLoginUrl(undefined, { isPopup: 'true' }),
      'SSO Login',
      `width=${width},height=${height},left=${left},top=${top}`
    )
  }

  return (
    <a
      ref={ref}
      href={getLoginUrl()}
      onClick={onClick}
      className={className}
      title="Login"
      data-testid="login-link"
    >
      {children}
    </a>
  )
}

export default forwardRef(LocalStorageLoginLink)
