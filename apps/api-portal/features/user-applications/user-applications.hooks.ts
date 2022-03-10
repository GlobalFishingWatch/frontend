import { useEffect, useCallback } from 'react'
import { AsyncError, AsyncReducerStatus } from 'lib/async-slice'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { UserData } from '@globalfishingwatch/api-types'
import { checkUserApplicationPermission } from 'features/user/user.hooks'
import { selectUserData } from '../user/user.slice'
import {
  createUserApplicationsThunk,
  deleteUserApplicationsThunk,
  fetchUserApplicationsThunk,
  selectUserApplicationsRequiredInfoCompleted,
  selectUserApplications,
  selectUserApplicationsIds,
  selectUserApplicationsStatus,
  UserApplicationCreateArguments,
  UserApplicationDeleteArguments,
} from './user-applications.slice'

export const useGetUserApplications = () => {
  const dispatch = useAppDispatch()

  const user: UserData = useAppSelector(selectUserData)
  const userApplicationsIds = useAppSelector(selectUserApplicationsIds)
  const userApplicationsList = useAppSelector(selectUserApplications)
  const userApplicationsStatus = useAppSelector(selectUserApplicationsStatus)
  const isAllowed = checkUserApplicationPermission('read', user?.permissions || [])
  const isUserApplicationsRequiredInfoCompleted = useAppSelector(
    selectUserApplicationsRequiredInfoCompleted
  )

  const dispatchDelete = useCallback(
    async ({ id }: UserApplicationDeleteArguments) => {
      const action = await dispatch(deleteUserApplicationsThunk({ id }))
      if (deleteUserApplicationsThunk.fulfilled.match(action as any)) {
        return { payload: (action as any)?.payload }
      } else {
        return { error: (action as any)?.payload as AsyncError }
      }
    },
    [dispatch]
  )

  useEffect(() => {
    if (!userApplicationsList.length && user && isAllowed) {
      dispatch(fetchUserApplicationsThunk({ userId: user.id }))
    }
  }, [dispatch, user, userApplicationsList, isAllowed])

  return {
    data: userApplicationsIds.map((id) => userApplicationsList[id]),
    isLoading: userApplicationsStatus === AsyncReducerStatus.Loading,
    isModifying:
      userApplicationsStatus in
      [
        AsyncReducerStatus.LoadingCreate,
        AsyncReducerStatus.LoadingDelete,
        AsyncReducerStatus.LoadingUpdate,
      ],
    isSuccess: userApplicationsStatus === AsyncReducerStatus.Finished,
    isError: userApplicationsStatus === AsyncReducerStatus.Error,
    isAborted: userApplicationsStatus === AsyncReducerStatus.Aborted,
    isAllowed,
    isUserApplicationsRequiredInfoCompleted,
    dispatchDelete,
  }
}

export const useCreateUserApplications = () => {
  const dispatch = useAppDispatch()
  const user: UserData = useAppSelector(selectUserData)
  const userApplicationsStatus = useAppSelector(selectUserApplicationsStatus)
  const isAllowed = checkUserApplicationPermission('create', user.permissions)
  const isUserApplicationsRequiredInfoCompleted = useAppSelector(
    selectUserApplicationsRequiredInfoCompleted
  )

  const dispatchCreate = useCallback(
    async (newUserApplication: UserApplicationCreateArguments) => {
      const action = await dispatch(
        createUserApplicationsThunk({ ...newUserApplication, userId: user.id })
      )
      if (createUserApplicationsThunk.fulfilled.match(action as any)) {
        return { payload: (action as any)?.payload }
      } else {
        return { error: (action as any)?.payload as AsyncError }
      }
    },
    [dispatch, user.id]
  )
  return {
    isSaving: userApplicationsStatus === AsyncReducerStatus.LoadingCreate,
    isSuccess: userApplicationsStatus === AsyncReducerStatus.Finished,
    isError: userApplicationsStatus === AsyncReducerStatus.Error,
    isAborted: userApplicationsStatus === AsyncReducerStatus.Aborted,
    isAllowed,
    isUserApplicationsRequiredInfoCompleted,
    dispatchCreate,
  }
}
