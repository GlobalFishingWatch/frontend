import { forwardRef } from 'react'
import { useSelector } from 'react-redux'

import { getLoginUrl, useLoginRedirect } from '@globalfishingwatch/react-hooks'

import { useAppDispatch } from 'features/app/app.hooks'
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

  const onClick = () => {
    dispatch(setWorkspaceSuggestSave(false))
    saveRedirectUrl()
    saveHistoryNavigation(workspaceHistoryNavigation)
  }

  return (
    <a ref={ref} href={getLoginUrl()} onClick={onClick} className={className} title="Login">
      {children}
    </a>
  )
}

export default forwardRef(LocalStorageLoginLink)
