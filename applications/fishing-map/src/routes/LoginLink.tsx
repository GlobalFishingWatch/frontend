import React, { forwardRef } from 'react'
import { getLoginUrl, useLoginRedirect } from './routes.hook'

type LocalStorageLoginLinkProps = {
  children: React.ReactNode
  className?: string
}

function LocalStorageLoginLink({ children, className = '' }: LocalStorageLoginLinkProps, ref: any) {
  const { onLoginClick } = useLoginRedirect()

  return (
    <a ref={ref} href={getLoginUrl()} onClick={onLoginClick} className={className}>
      {children}
    </a>
  )
}

export default forwardRef(LocalStorageLoginLink)
