import { useCallback, useMemo } from 'react'
import { intersection } from 'lodash'
import { useDispatch } from 'react-redux'
import useGFWLogin from '@globalfishingwatch/react-hooks/dist/use-login'
import GFWAPI from '@globalfishingwatch/api-client'
import { AUTHORIZED_USER_GROUPS } from 'data/config'
import { BASE_URL } from 'data/constants'
import { logoutUserThunk } from './user.slice'

export const useUser = () => {
  const dispatch = useDispatch()
  const { loading, logged, user } = useGFWLogin(GFWAPI)
  const authorized = useMemo(() => {
    return user && intersection(user.groups, AUTHORIZED_USER_GROUPS).length > 0
  }, [user])

  const login = useCallback(() => {
    const location = window.location.origin + BASE_URL
    window.location.assign(GFWAPI.getLoginUrl(location))
  }, [])

  const logout = useCallback(() => dispatch(logoutUserThunk({ redirectTo: 'home' })), [dispatch])

  return { loading, logged, user, authorized, login, logout }
}
