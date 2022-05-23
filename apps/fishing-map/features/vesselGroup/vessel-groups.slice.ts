import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { VesselGroup } from '@globalfishingwatch/api-types'
import { GFWAPI, FetchOptions } from '@globalfishingwatch/api-client'
import { WorkspaceState } from 'types'
import { RootState } from 'store'
import { HOME, WORKSPACE } from 'routes/routes'
import { AsyncReducerStatus, AsyncError } from 'utils/async-slice'
import { isGFWUser, isGuestUser } from 'features/user/user.slice'

interface VesselGroupsSliceState {
  status: AsyncReducerStatus
  error: AsyncError
  data: VesselGroup[]
  isModalOpen: boolean
}

const VESSEL_GROUP_MOCK = [
  { id: 'vesselGroup1', vesselIDs: ['1', '2', '3', '4', '5', '6'], name: 'Long Xing' },
  {
    id: 'vesselGroup2',
    vesselIDs: ['1', '2', '3', '4', '5', '6', '11', '12', '13', '14', '15', '16'],
    name: 'My Custom vessel group 1',
  },
]

const initialState: VesselGroupsSliceState = {
  status: AsyncReducerStatus.Idle,
  error: {},
  data: VESSEL_GROUP_MOCK,
  isModalOpen: false,
}

// export const getDefaultWorkspace = () => {
//   const workspaceEnv = getWorkspaceEnv()
//   const workspace = import(`../../data/default-workspaces/workspace.${workspaceEnv}`).then(
//     (m) => m.default
//   )
//   return workspace as Promise<Workspace<WorkspaceState>>
// }

// export const fetchWorkspaceThunk = createAsyncThunk(
//   'workspace/fetch',
//   async (workspaceId: string, { signal, dispatch, getState, rejectWithValue }) => {
//     const state = getState() as RootState
//     const version = selectVersion(state)
//     const locationType = selectLocationType(state)
//     const urlDataviewInstances = selectUrlDataviewInstances(state)
//     const guestUser = isGuestUser(state)
//     const gfwUser = isGFWUser(state)

//     try {
//       let workspace = workspaceId
//         ? await GFWAPI.fetch<Workspace<WorkspaceState>>(`/${version}/workspaces/${workspaceId}`, {
//             signal,
//           })
//         : null
//       if (!workspace && locationType === HOME) {
//         workspace = await getDefaultWorkspace()
//       }

//       if (!workspace) {
//         return
//       }

//       const daysFromLatest =
//         selectDaysFromLatest(state) || workspace.state?.daysFromLatest || undefined
//       const endAt =
//         daysFromLatest !== undefined
//           ? DateTime.fromISO(DEFAULT_TIME_RANGE.end).toUTC()
//           : DateTime.fromISO(workspace.endAt).toUTC()
//       const startAt =
//         daysFromLatest !== undefined
//           ? endAt.minus({ days: daysFromLatest })
//           : DateTime.fromISO(workspace.startAt).toUTC()

//       const defaultWorkspaceDataviews = gfwUser
//         ? [...DEFAULT_DATAVIEW_IDS, VESSEL_PRESENCE_DATAVIEW_ID] // Only for gfw users as includes the private-global-presence-tracks dataset
//         : DEFAULT_DATAVIEW_IDS

//       const dataviewIds = [
//         ...defaultWorkspaceDataviews,
//         ...(workspace.dataviews || []).map(({ id }) => id as number),
//         ...(workspace.dataviewInstances || []).map(({ dataviewId }) => dataviewId),
//         ...(urlDataviewInstances || []).map(({ dataviewId }) => dataviewId as number),
//       ].filter(Boolean)

//       const uniqDataviewIds = uniq(dataviewIds)

//       let dataviews: Dataview[] = []
//       if (uniqDataviewIds?.length) {
//         const fetchDataviewsAction: any = dispatch(fetchDataviewsByIdsThunk(uniqDataviewIds))
//         signal.addEventListener('abort', fetchDataviewsAction.abort)
//         const { payload } = await fetchDataviewsAction
//         if (payload?.length) {
//           dataviews = payload
//         }
//       }

//       if (!signal.aborted) {
//         const dataviewInstances = [
//           ...dataviews,
//           ...(workspace.dataviewInstances || []),
//           ...(urlDataviewInstances || []),
//         ]
//         const datasets = getDatasetsInDataviews(dataviewInstances, guestUser)
//         const fetchDatasetsAction: any = dispatch(fetchDatasetsByIdsThunk(datasets))
//         signal.addEventListener('abort', fetchDatasetsAction.abort)
//         const { error, payload } = await fetchDatasetsAction
//         if (error) {
//           return rejectWithValue({ workspace, error: payload })
//         }
//       }

//       return { ...workspace, startAt: startAt.toISO(), endAt: endAt.toISO() }
//     } catch (e: any) {
//       return rejectWithValue({ error: e as AsyncError })
//     }
//   },
//   {
//     condition: (workspaceId, { getState }) => {
//       const workspaceStatus = selectWorkspaceStatus(getState() as RootState)
//       // Fetched already in progress, don't need to re-fetch
//       return workspaceStatus !== AsyncReducerStatus.Loading
//     },
//   }
// )

// export const saveWorkspaceThunk = createAsyncThunk(
//   'workspace/saveCurrent',
//   async (
//     {
//       name: defaultName,
//       createAsPublic,
//       workspace,
//     }: {
//       name: string
//       createAsPublic: boolean
//       workspace?: AppWorkspace
//     },
//     { dispatch, getState }
//   ) => {
//     const state = getState() as RootState
//     const workspaceUpsert = parseUpsertWorkspace(workspace)

//     const saveWorkspace = async (tries = 0): Promise<Workspace<WorkspaceState> | undefined> => {
//       let workspaceUpdated
//       if (tries < 5) {
//         try {
//           const version = selectVersion(state)
//           const name = tries > 0 ? defaultName + `_${tries}` : defaultName
//           workspaceUpdated = await GFWAPI.fetch<Workspace<WorkspaceState>>(
//             `/${version}/workspaces`,
//             {
//               method: 'POST',
//               body: {
//                 ...workspaceUpsert,
//                 name,
//                 public: createAsPublic,
//               },
//             } as FetchOptions<WorkspaceUpsert<WorkspaceState>>
//           )
//         } catch (e: any) {
//           // Means we already have a workspace with this name
//           if (e.status === 400) {
//             return await saveWorkspace(tries + 1)
//           }
//           throw e
//         }
//         return workspaceUpdated
//       }
//     }

//     const workspaceUpdated = await saveWorkspace()
//     const locationType = selectLocationType(state)
//     const locationCategory = selectLocationCategory(state) || WorkspaceCategories.FishingActivity
//     if (workspaceUpdated) {
//       dispatch(
//         updateLocation(locationType === HOME ? WORKSPACE : locationType, {
//           payload: {
//             category: locationCategory,
//             workspaceId: workspaceUpdated.id,
//           },
//           replaceQuery: true,
//         })
//       )
//     }
//     return workspaceUpdated
//   }
// )

// export const updatedCurrentWorkspaceThunk = createAsyncThunk(
//   'workspace/updatedCurrent',
//   async (workspace: AppWorkspace, { dispatch, getState }) => {
//     const state = getState() as RootState
//     const version = selectVersion(state)
//     const workspaceUpsert = parseUpsertWorkspace(workspace)

//     const workspaceUpdated = await GFWAPI.fetch<Workspace<WorkspaceState>>(
//       `/${version}/workspaces/${workspace.id}`,
//       {
//         method: 'PATCH',
//         body: workspaceUpsert,
//       } as FetchOptions<WorkspaceUpsert<WorkspaceState>>
//     )
//     if (workspaceUpdated) {
//       dispatch(cleanQueryLocation())
//     }
//     return workspaceUpdated
//   }
// )

const vesselGroupsSlice = createSlice({
  name: 'vesselGroups',
  initialState,
  reducers: {
    setModalOpen: (state) => {
      state.isModalOpen = true
    },
    setModalClosed: (state) => {
      state.isModalOpen = false
    },
    // cleanCurrentWorkspaceData: (state) => {
    //   state.data = null
    // },
  },
  //   extraReducers: (builder) => {
  //     builder.addCase(fetchWorkspaceThunk.pending, (state) => {
  //       state.status = AsyncReducerStatus.Loading
  //     })
  //     builder.addCase(fetchWorkspaceThunk.fulfilled, (state, action) => {
  //       state.status = AsyncReducerStatus.Finished
  //       const payload = action.payload as any
  //       if (payload) {
  //         state.data = payload
  //       }
  //     })
  //     builder.addCase(fetchWorkspaceThunk.rejected, (state, action) => {
  //       if (action.payload) {
  //         const { workspace, error } = action.payload as RejectedActionPayload
  //         state.status = AsyncReducerStatus.Error
  //         if (workspace) {
  //           state.data = workspace
  //         }
  //         if (error) {
  //           state.error = error
  //         }
  //       } else {
  //         // This means action was cancelled
  //         state.status = AsyncReducerStatus.Idle
  //       }
  //     })
  //     builder.addCase(saveWorkspaceThunk.pending, (state) => {
  //       state.customStatus = AsyncReducerStatus.Loading
  //     })
  //     builder.addCase(saveWorkspaceThunk.fulfilled, (state, action) => {
  //       state.customStatus = AsyncReducerStatus.Finished
  //       if (action.payload) {
  //         state.data = action.payload
  //       }
  //     })
  //     builder.addCase(saveWorkspaceThunk.rejected, (state) => {
  //       state.customStatus = AsyncReducerStatus.Error
  //     })
  //     builder.addCase(updatedCurrentWorkspaceThunk.pending, (state) => {
  //       state.customStatus = AsyncReducerStatus.Loading
  //     })
  //     builder.addCase(updatedCurrentWorkspaceThunk.fulfilled, (state, action) => {
  //       state.customStatus = AsyncReducerStatus.Finished
  //       if (action.payload) {
  //         state.data = action.payload
  //       }
  //     })
  //     builder.addCase(updatedCurrentWorkspaceThunk.rejected, (state) => {
  //       state.customStatus = AsyncReducerStatus.Error
  //     })
  //   },
})

export const { setModalOpen, setModalClosed } = vesselGroupsSlice.actions

export default vesselGroupsSlice.reducer
