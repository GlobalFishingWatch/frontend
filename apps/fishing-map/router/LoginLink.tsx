import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Tooltip } from '@globalfishingwatch/ui-components'

import { usePopupLogin } from './LoginLink.hooks'

type LocalStorageLoginLinkProps = {
  children: React.ReactNode
  className?: string
}

function LocalStorageLoginLink({ children, className = '' }: LocalStorageLoginLinkProps, ref: any) {
  const { t } = useTranslation()
  const onClick = usePopupLogin()

  return (
    <Tooltip content={t((t) => t.common.login)}>
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
