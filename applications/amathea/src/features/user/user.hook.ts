import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { fetchUserThunk, logoutUserThunk, isUserLogged, selectUserStatus } from './user.slice'

export const useUserConnect = () => {
  const dispatch = useDispatch()
  const logged = useSelector(isUserLogged)
  const status = useSelector(selectUserStatus)
  const fetchUser = useCallback(() => {
    dispatch(fetchUserThunk())
  }, [dispatch])
  const logoutUser = useCallback(() => {
    dispatch(logoutUserThunk())
  }, [dispatch])
  return { logged, status, fetchUser, logoutUser }
}
