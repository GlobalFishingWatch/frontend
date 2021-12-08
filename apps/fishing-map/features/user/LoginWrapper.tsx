import React from 'react'
import { Placement } from 'tippy.js'
import { useSelector } from 'react-redux'
import { getLoginUrl } from '@globalfishingwatch/react-hooks'
import { IconButtonProps, ButtonProps } from '@globalfishingwatch/ui-components'
import { isGuestUser } from 'features/user/user.slice'

interface LoginWrapperProps {
  tooltip?: string
  tooltipPlacement?: Placement
  children: JSX.Element
}

export function LoginWrapper({ children, tooltip, tooltipPlacement = 'auto' }: LoginWrapperProps) {
  const guestUser = useSelector(isGuestUser)
  if (!guestUser) {
    return children
  }

  const childrenWithoutAction = React.Children.map(
    children,
    (child: React.ReactElement<IconButtonProps | ButtonProps>) => {
      // Checking isValidElement is the safe way and avoids a typescript error too.
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { onClick: undefined, tooltip, tooltipPlacement })
      }
      return child
    }
  )
  return <a href={getLoginUrl()}>{childrenWithoutAction}</a>
}
