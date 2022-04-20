import { useRouter } from 'next/router'
import { Fragment, ReactNode, useEffect } from 'react'
import { useGetUserApplications } from 'features/user-applications/user-applications.hooks'

/* eslint-disable-next-line */
export interface RequireAdditionalInfoProps {
  children: ReactNode
}

export function RequireAdditionalInfo({ children }: RequireAdditionalInfoProps) {
  const { isUserApplicationsRequiredInfoCompleted } = useGetUserApplications()
  const router = useRouter()

  useEffect(() => {
    if (
      isUserApplicationsRequiredInfoCompleted !== null &&
      !isUserApplicationsRequiredInfoCompleted
    ) {
      router.push('/signup')
    }
  }, [isUserApplicationsRequiredInfoCompleted, router])

  return <Fragment>{children}</Fragment>
}

export default RequireAdditionalInfo
