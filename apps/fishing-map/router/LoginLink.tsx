import { forwardRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { getLoginUrl, useLoginRedirect } from '@globalfishingwatch/react-hooks'
import { Modal } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/config'
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
  const [iframeOpen, setIframeOpen] = useState(false)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type === 'LOGIN_SUCCESS') {
        dispatch(fetchUserThunk({ accessToken: event.data.accessToken }))
        setIframeOpen(false)
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
    setIframeOpen(true)
  }

  return (
    <>
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
      {iframeOpen && (
        <Modal
          appSelector={ROOT_DOM_ELEMENT}
          isOpen={iframeOpen}
          onClose={() => setIframeOpen(false)}
        >
          <iframe
            src={getLoginUrl()}
            style={{ width: '100%', height: '80vh', border: 'none', minHeight: '600px' }}
            title="SSO Login"
          />
        </Modal>
      )}
    </>
  )
}

export default forwardRef(LocalStorageLoginLink)
