import React, { useEffect } from 'react'
import GFWAPI from '@globalfishingwatch/api-client'
import { useUserConnect } from './user.hook'

export default function Login(): React.ReactElement | null {
  const { status, logged, fetchUser } = useUserConnect()

  useEffect(() => {
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if ((status === 'finished' || status === 'error') && !logged) {
    window.location.href = GFWAPI.getLoginUrl(window.location.toString())
  }
  return null
}
