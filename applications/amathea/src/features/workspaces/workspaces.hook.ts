import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { Workspace } from '@globalfishingwatch/dataviews-client'
import { selectCurrentWorkspaceDataviews } from 'features/dataviews/dataviews.selectors'
import {
  fetchWorkspacesThunk,
  deleteWorkspaceThunk,
  createWorkspaceThunk,
  updateWorkspaceThunk,
  selectAll,
  selectShared,
  fetchWorkspaceByIdThunk,
  selectCurrentWorkspace,
  selectWorkspaceStatus,
} from './workspaces.slice'

export const useWorkspacesAPI = () => {
  const dispatch = useDispatch()

  const fetchWorkspaces = useCallback(async (): Promise<Workspace[]> => {
    const { payload }: any = await dispatch(fetchWorkspacesThunk())
    return payload
  }, [dispatch])

  const fetchWorkspaceById = useCallback(
    async (id: number): Promise<Workspace> => {
      const { payload }: any = await dispatch(fetchWorkspaceByIdThunk(id))
      return payload
    },
    [dispatch]
  )

  const deleteWorkspace = useCallback(
    (id: number) => {
      dispatch(deleteWorkspaceThunk(id))
    },
    [dispatch]
  )

  const updateWorkspace = useCallback(
    async (workspace: Partial<Workspace>): Promise<Workspace> => {
      const { payload }: any = await dispatch(updateWorkspaceThunk(workspace))
      return payload
    },
    [dispatch]
  )

  const createWorkspace = useCallback(
    async (workspace: Partial<Workspace>): Promise<Workspace> => {
      const { payload }: any = await dispatch(createWorkspaceThunk(workspace))
      return payload
    },
    [dispatch]
  )

  const upsertWorkspace = useCallback(
    async (partialWorkspace: Partial<Workspace>): Promise<Workspace> => {
      if (partialWorkspace.id) {
        return updateWorkspace(partialWorkspace)
      } else {
        return createWorkspace(partialWorkspace)
      }
    },
    [createWorkspace, updateWorkspace]
  )

  return {
    fetchWorkspaces,
    fetchWorkspaceById,
    deleteWorkspace,
    createWorkspace,
    updateWorkspace,
    upsertWorkspace,
  }
}

export const useWorkspacesConnect = () => {
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspacesList = useSelector(selectAll)
  const workspacesSharedList = useSelector(selectShared)

  return {
    workspaceStatus,
    workspacesList,
    workspacesSharedList,
  }
}

export const useCurrentWorkspaceConnect = () => {
  const workspace = useSelector(selectCurrentWorkspace)
  return { workspace }
}

export const useWorkspaceDataviewsConnect = () => {
  const dataviews = useSelector(selectCurrentWorkspaceDataviews)
  return { dataviews }
}
