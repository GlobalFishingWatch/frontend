import { forwardRef } from 'react'

import { Tooltip } from '@globalfishingwatch/ui-components'

import { usePopupLogin } from './LoginLink.hooks'

type LocalStorageLoginLinkProps = {
  children: React.ReactNode
  className?: string
  tooltip?: string
}

function LocalStorageLoginLink(
  { children, className = '', tooltip }: LocalStorageLoginLinkProps,
  ref: any
) {
  const onClick = usePopupLogin()

  return (
    <Tooltip content={tooltip}>
      <span
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={onClick}
        className={className}
        data-testid="login-link"
      >
        {children}
      </span>
    </Tooltip>
  )
}

export default forwardRef(LocalStorageLoginLink)
