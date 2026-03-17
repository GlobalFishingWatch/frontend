import { Children, cloneElement, isValidElement, type JSX } from 'react'
import { useSelector } from 'react-redux'

import type { ButtonProps,IconButtonProps,TooltipPlacement  } from '@globalfishingwatch/ui-components'

import { selectIsGuestUser } from 'features/user/selectors/user.selectors'

import LocalStorageLoginLink from './LoginLink'

interface LoginButtonWrapperProps {
  tooltip?: string
  tooltipPlacement?: TooltipPlacement
  children: JSX.Element
}

const LoginButtonWrapper = ({
  children,
  tooltip,
  tooltipPlacement = 'top',
}: LoginButtonWrapperProps) => {
  const guestUser = useSelector(selectIsGuestUser)

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
