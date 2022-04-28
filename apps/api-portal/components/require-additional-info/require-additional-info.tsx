import { useRouter } from 'next/router'
import { Fragment, ReactNode, useEffect } from 'react'
import useUser from 'features/user/user'

/* eslint-disable-next-line */
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
