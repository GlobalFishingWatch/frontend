import { useSelector } from 'react-redux'
import { useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { UserData } from '@globalfishingwatch/api-types'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectUserData, setUserData } from './user.slice'

export const useUserData = (userData: UserData) => {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()
  const [bearerToken, refreshToken] = useMemo(
    () => [GFWAPI.getToken(), GFWAPI.getRefreshToken()],
    []
  )
  const user = useSelector(selectUserData)

  useEffect(() => {
    // Update tokens in GFWAPI for backward compat
    if (session && session['bearerToken'] && session['bearerToken'] !== bearerToken) {
      GFWAPI.setToken(session['bearerToken'])
    }
    if (session && session['refreshToken'] && session['refreshToken'] !== refreshToken) {
      GFWAPI.setRefreshToken(session['refreshToken'])
    }
  }, [session, bearerToken, refreshToken])

  useEffect(() => {
    dispatch(setUserData(userData))
  }, [dispatch, userData])

  return user
}
