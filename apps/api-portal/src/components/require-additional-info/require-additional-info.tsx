import type { ReactNode} from 'react';
import { Fragment, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

import useUser from 'features/user/user'

 
export interface RequireAdditionalInfoProps {
  children: ReactNode
}

export function RequireAdditionalInfo({ children }: RequireAdditionalInfoProps) {
  const { isUserApplicationsRequiredInfoCompleted, isFetched, isSuccess } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (
      isUserApplicationsRequiredInfoCompleted !== undefined &&
      !isUserApplicationsRequiredInfoCompleted
    ) {
      navigate({ to: '/signup' })
    }
  }, [isUserApplicationsRequiredInfoCompleted, navigate])

  return <Fragment>{children}</Fragment>
}

export default RequireAdditionalInfo
