import { forwardRef } from 'react'

import { getLoginUrl, useLoginRedirect } from '@globalfishingwatch/react-hooks'

import { useAppDispatch } from 'features/app/app.hooks'
import { setWorkspaceSuggestSave } from 'features/workspace/workspace.slice'

type LocalStorageLoginLinkProps = {
  children: React.ReactNode
  className?: string
}

function LocalStorageLoginLink({ children, className = '' }: LocalStorageLoginLinkProps, ref: any) {
  const { saveRedirectUrl } = useLoginRedirect()
  const dispatch = useAppDispatch()

  const onClick = () => {
    dispatch(setWorkspaceSuggestSave(false))
    saveRedirectUrl()
  }

  return (
    <a ref={ref} href={getLoginUrl()} onClick={onClick} className={className} title="Login">
      {children}
    </a>
  )
}

export default forwardRef(LocalStorageLoginLink)
