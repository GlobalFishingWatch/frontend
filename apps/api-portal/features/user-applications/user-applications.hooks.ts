import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AsyncReducerStatus } from 'lib/async-slice'
import { UserData } from '@globalfishingwatch/api-types'
import { checkUserApplicationPermission } from 'features/user/user.hooks'
import { selectUserData } from '../user/user.slice'
import {
  fetchUserApplicationsThunk,
  selectUserApplications,
  selectUserApplicationsIds,
  selectUserApplicationsStatus,
} from './user-applications.slice'

export const useGetUserApplications = () => {
  const dispatch = useDispatch()

  const user: UserData = useSelector(selectUserData)
  const userApplicationsIds = useSelector(selectUserApplicationsIds)
  const userApplicationsList = useSelector(selectUserApplications)
  const userApplicationsStatus = useSelector(selectUserApplicationsStatus)
  const isAllowed = checkUserApplicationPermission('read', user.permissions)

  useEffect(() => {
    if (!userApplicationsList.length && user && isAllowed) {
      dispatch(fetchUserApplicationsThunk({ userId: user.id }))
    }
  }, [dispatch, user, userApplicationsList, isAllowed])

  return {
    data: userApplicationsIds.map((id) => userApplicationsList[id]),
    isLoading: userApplicationsStatus === AsyncReducerStatus.Loading,
    isSuccess: userApplicationsStatus === AsyncReducerStatus.Finished,
    isError: userApplicationsStatus === AsyncReducerStatus.Error,
    isAborted: userApplicationsStatus === AsyncReducerStatus.Aborted,
    isAllowed,
  }
}
