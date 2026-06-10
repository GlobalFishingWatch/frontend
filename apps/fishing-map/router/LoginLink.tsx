import { forwardRef } from 'react'

import { Tooltip } from '@globalfishingwatch/ui-components'

import { usePopupLogin } from './LoginLink.hooks'

type LoginLinkProps = {
  children: React.ReactNode
  className?: string
  tooltip?: string
}

function LoginLink({ children, className = '', tooltip }: LoginLinkProps, ref: any) {
  const openPopupLogin = usePopupLogin()

  return (
    <Tooltip content={tooltip}>
      <span
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={openPopupLogin}
        className={className}
        data-testid="login-link"
      >
        {children}
      </span>
    </Tooltip>
  )
}

export default forwardRef(LoginLink)
