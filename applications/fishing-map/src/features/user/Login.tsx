import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import GFWAPI from '@globalfishingwatch/api-client'
import { selectUserResolved, fetchUser, isUserLogged } from './user.slice'

export default function Login(): React.ReactElement | null {
  const dispatch = useDispatch()
  const logged = useSelector(isUserLogged)
  const resolved = useSelector(selectUserResolved)

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  if (resolved && !logged) {
    window.location.href = GFWAPI.getLoginUrl(window.location.toString())
  }
  return null
}
