import React, { forwardRef } from 'react'

import { getLoginUrl, useLoginRedirect } from '@globalfishingwatch/react-hooks'

type LocalStorageLoginLinkProps = {
  children: React.ReactNode
  className?: string
}

function LocalStorageLoginLink({ children, className = '' }: LocalStorageLoginLinkProps, ref: any) {
  const { saveRedirectUrl } = useLoginRedirect()

  return (
    <a ref={ref} href={getLoginUrl()} onClick={saveRedirectUrl} className={className} title="Login">
      {children}
    </a>
  )
}

export default forwardRef(LocalStorageLoginLink)
