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

  const childrenWithoutAction = React.Children.map(
    children,
    (child: React.ReactElement<IconButtonProps | ButtonProps>) => {
      // Checking isValidElement is the safe way and avoids a typescript error too.
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
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
