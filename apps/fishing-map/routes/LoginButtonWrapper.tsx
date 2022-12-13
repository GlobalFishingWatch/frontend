import { Children, isValidElement, cloneElement } from 'react'
import { Placement } from 'tippy.js'
import { useSelector } from 'react-redux'
import { IconButtonProps, ButtonProps } from '@globalfishingwatch/ui-components'
import { isGuestUser } from 'features/user/user.slice'
import LocalStorageLoginLink from './LoginLink'

interface LoginButtonWrapperProps {
  tooltip?: string
  tooltipPlacement?: Placement
  children: JSX.Element
}

const LoginButtonWrapper = ({
  children,
  tooltip,
  tooltipPlacement = 'auto',
}: LoginButtonWrapperProps) => {
  const guestUser = useSelector(isGuestUser)

  if (!guestUser) {
    return children
  }

  const childrenWithoutAction = Children.map(
    children,
    (child: React.ReactElement<IconButtonProps | ButtonProps>) => {
      // Checking isValidElement is the safe way and avoids a typescript error too.
      if (isValidElement(child)) {
        return cloneElement(child, {
          onClick: undefined,
          tooltip,
          tooltipPlacement,
          // enabling inner button as logic is handled by the parent component
          disabled: false,
        })
      }
      return child
    }
  )
  return <LocalStorageLoginLink>{childrenWithoutAction}</LocalStorageLoginLink>
}

export default LoginButtonWrapper
