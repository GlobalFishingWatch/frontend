import type { ReactNode} from 'react';
import { Fragment, useEffect } from 'react'
import { useRouter } from 'next/router'

import useUser from 'features/user/user'

 
export interface RequireAdditionalInfoProps {
  children: ReactNode
}

export function RequireAdditionalInfo({ children }: RequireAdditionalInfoProps) {
  const { isUserApplicationsRequiredInfoCompleted, isFetched, isSuccess } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (
      isUserApplicationsRequiredInfoCompleted !== undefined &&
      !isUserApplicationsRequiredInfoCompleted
    ) {
      router.push('/signup')
    }
  }, [isUserApplicationsRequiredInfoCompleted, router])

  return <Fragment>{children}</Fragment>
}

export default RequireAdditionalInfo
