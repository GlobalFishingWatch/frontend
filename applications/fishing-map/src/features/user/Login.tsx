import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import GFWAPI from '@globalfishingwatch/api-client'
import { selectUserStatus, fetchUserThunk, selectUserLogged } from './user.slice'

export default function Login(): React.ReactElement | null {
  const dispatch = useDispatch()
  const logged = useSelector(selectUserLogged)
  const status = useSelector(selectUserStatus)

  useEffect(() => {
    dispatch(fetchUserThunk())
  }, [dispatch])

  if ((status === 'finished' || status === 'error') && !logged) {
    window.location.href = GFWAPI.getLoginUrl(window.location.toString())
  }
  return null
}
