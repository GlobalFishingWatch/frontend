import { forwardRef, useCallback } from 'react'

import { Tooltip } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { setLoginSource } from 'features/user/user.slice'
import type { LoginSource } from 'features/user/user.types'

import { usePopupLogin } from './user.hooks'

type LoginLinkProps = {
  children: React.ReactNode
  className?: string
  tooltip?: string
  loginSource?: LoginSource
  dataTestId?: string
}

function LoginLink(
  { children, className = '', tooltip, loginSource, dataTestId = 'login-link' }: LoginLinkProps,
  ref: any
) {
  const dispatch = useAppDispatch()
  const openPopupLogin = usePopupLogin()

  const onLoginClick = useCallback(
    (e: React.MouseEvent) => {
      openPopupLogin(e)
      if (loginSource) {
        dispatch(setLoginSource(loginSource))
      }
      trackEvent({
        category: TrackCategory.User,
        action: `Clicked login button${loginSource ? ` from ${loginSource}` : ''}`,
      })
    },
    [dispatch, loginSource, openPopupLogin]
  )

  return (
    <Tooltip content={tooltip}>
      <span
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={onLoginClick}
        className={className}
        data-testid={dataTestId}
      >
        {children}
      </span>
    </Tooltip>
  )
}

export default forwardRef(LoginLink)
