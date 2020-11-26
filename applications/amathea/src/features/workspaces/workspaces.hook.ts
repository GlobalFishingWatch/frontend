import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { Workspace, WorkspaceUpsert } from '@globalfishingwatch/api-types'
import { selectCurrentWorkspaceDataviewsResolved } from 'features/dataviews/dataviews.selectors'
import {
  fetchWorkspacesThunk,
  deleteWorkspaceThunk,
  createWorkspaceThunk,
  updateWorkspaceThunk,
  selectAllWorkspaces,
  selectShared,
  fetchWorkspaceByIdThunk,
  selectCurrentWorkspace,
  selectWorkspaceStatus,
  selectWorkspaceStatusId,
} from './workspaces.slice'

export const useWorkspacesAPI = () => {
  const dispatch = useDispatch()

  const fetchWorkspaces = useCallback(async (): Promise<Workspace[]> => {
    const { payload }: any = await dispatch(fetchWorkspacesThunk())
    return payload
  }, [dispatch])

  const fetchWorkspaceById = useCallback(
    async (id: string): Promise<Workspace> => {
      const { payload }: any = await dispatch(fetchWorkspaceByIdThunk(id))
      return payload
    },
    [dispatch]
  )

  const deleteWorkspace = useCallback(
    async (id: string): Promise<Workspace> => {
      const { payload }: any = await dispatch(deleteWorkspaceThunk(id))
      return payload
    },
    [dispatch]
  )

  const updateWorkspace = useCallback(
    async (workspace: WorkspaceUpsert): Promise<Workspace> => {
      const { payload }: any = await dispatch(updateWorkspaceThunk(workspace))
      return payload
    },
    [dispatch]
  )

  const createWorkspace = useCallback(
    async (workspace: WorkspaceUpsert): Promise<Workspace> => {
      const { payload }: any = await dispatch(createWorkspaceThunk(workspace))
      return payload
    },
    [dispatch]
  )

  const upsertWorkspace = useCallback(
    async (partialWorkspace: WorkspaceUpsert): Promise<Workspace> => {
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
  const workspaceStatusId = useSelector(selectWorkspaceStatusId)
  const workspacesList = useSelector(selectAllWorkspaces)
  const workspacesSharedList = useSelector(selectShared)

  return {
    workspaceStatus,
    workspaceStatusId,
    workspacesList,
    workspacesSharedList,
  }
}

export const useCurrentWorkspaceConnect = () => {
  const workspace = useSelector(selectCurrentWorkspace)
  return { workspace }
}

export const useWorkspaceDataviewsConnect = () => {
  const dataviews = useSelector(selectCurrentWorkspaceDataviewsResolved)
  return { dataviews }
}
