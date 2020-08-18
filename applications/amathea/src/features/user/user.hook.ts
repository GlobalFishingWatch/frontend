import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import GFWAPI from '@globalfishingwatch/api-client'
import { fetchUserThunk, logoutUserThunk, isUserLogged, selectUserStatus } from './user.slice'

export const useUserConnect = () => {
  const dispatch = useDispatch()
  const logged = useSelector(isUserLogged)
  const status = useSelector(selectUserStatus)
  const token = GFWAPI.getToken()

  const fetchUser = useCallback(() => {
    dispatch(fetchUserThunk())
  }, [dispatch])

  const logoutUser = useCallback(() => {
    dispatch(logoutUserThunk())
  }, [dispatch])

  return { logged, status, token, fetchUser, logoutUser }
}
