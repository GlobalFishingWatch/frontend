import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import GFWAPI from '@globalfishingwatch/api-client'
import { Vessel } from '@globalfishingwatch/api-types'
import { GFWDetail, TMTDetail, VesselAPISource, VesselWithHistory } from 'types'
import {
  AsyncError,
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { VesselSourceId } from 'types/vessel'
import gfwThunk from 'features/vessels/sources/gfw.slice'
import tmtThunk from 'features/vessels/sources/tmt.slice'
import { RootState } from '../../store'
import { mergeVesselFromSources } from './vessels.utils'
// import vesselThunk as gfwThunk from 'vessels/s vessels//sources/gfw.slice'

// export type IVesselInfo = {
//   gfwData: GFWDetail | null
//   tmtData: TMTDetail | null
// }

// interface Dictionary<T> {
//   [Key: string]: T
// }

// type VesselsSlice = {
//   vessels: Dictionary<IVesselInfo>
//   events: Dictionary<any>
// }

// const initialState: VesselsSlice = {
//   vessels: {},
//   events: {},
// }

// const slice = createSlice({
//   name: 'vessels',
//   initialState,
//   reducers: {
//     setVesselInfo: (state, action: PayloadAction<{ id: string; data: IVesselInfo }>) => {
//       state.vessels[action.payload.id] = action.payload.data
//     },

//     setVesselEvents: (state, action: PayloadAction<{ id: string; data: any }>) => {
//       state.events[action.payload.id] = action.payload.data
//     },
//   },
// })
// export const { setVesselEvents, setVesselInfo } = slice.actions
// export default slice.reducer

// export const selectVessels = (state: RootState) => state.vessels.vessels
// export const selectEvents = (state: RootState) => state.vessels.events

/* Refactored */
export type VesselState = AsyncReducer<VesselWithHistory>

const initialState: VesselState = {
  ...asyncInitialState,
}
export interface VesselAPIThunk {
  fetchById(id: VesselSourceId): Promise<VesselWithHistory>
}

const getVesselFromSourceAPI: (source: VesselAPISource) => VesselAPIThunk = (
  source: VesselAPISource
) => {
  const thunks = {
    [VesselAPISource.GFW]: gfwThunk,
    [VesselAPISource.TMT]: tmtThunk,
  }
  return thunks[source]
}

export type FetchVessel = {
  source: VesselAPISource
  sourceId: VesselSourceId
}

export const fetchVesselByIdThunk = createAsyncThunk<
  VesselWithHistory,
  FetchVessel[],
  {
    rejectValue: AsyncError
  }
>('vessels/fetchById', async (vesselsToFetch: FetchVessel[], { rejectWithValue }) => {
  try {
    const vessels = await Promise.all(
      vesselsToFetch.map(async ({ source, sourceId }) => ({
        source,
        vessel: await getVesselFromSourceAPI(source).fetchById(sourceId),
      }))
    )

    return mergeVesselFromSources(vessels)
  } catch (e) {
    return rejectWithValue({
      status: e.status || e.code,
      message: e.message,
    })
  }
})

const { slice: vesselsSlice, entityAdapter } = createAsyncSlice<VesselState, VesselWithHistory>({
  name: 'vessels',
  thunks: {
    fetchByIdThunk: fetchVesselByIdThunk,
  },
})

export const { selectById, selectIds } = entityAdapter.getSelectors<RootState>(
  (state) => state.vessels
)

export const selectVesselById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => {
    // const gfwId = vesselIds.find((fetchVessel) => fetchVessel.source === VesselAPISource.GFW)
    //   ?.sourceId

    // const tmtId = vesselIds.find((fetchVessel) => fetchVessel.source === VesselAPISource.TMT)
    //   ?.sourceId

    // const id = [gfwId?.dataset ?? 'NA', gfwId?.id ?? 'NA', tmtId?.id ?? 'NA'].join('/')
    return selectById(state, id)
  })
)

// const vesselsSlice = createSlice({
//   name: 'vessel',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(fetchVesselByIdThunk.pending, (state, action) => {
//       state.status = AsyncReducerStatus.Loading
//     })
//     builder.addCase(fetchVesselByIdThunk.fulfilled, (state, action) => {
//       state.status = AsyncReducerStatus.Finished
//     })
//     builder.addCase(fetchVesselByIdThunk.rejected, (state, action) => {
//       if (action.error.message === 'Aborted') {
//         state.status = AsyncReducerStatus.Aborted
//       } else {
//         state.status = AsyncReducerStatus.Error
//       }
//     })
//   },
// })

export const selectVessels = (state: RootState) => state.vessels.entities

// export const {
//   setFilters,
//   setFiltersOpen,
//   resetFilters,
//   setSuggestionClicked,
//   cleanVesselSearchResults,
// } = vesselSlice.actions
// const { slice: vesselsSlice, entityAdapter } = createAsyncSlice<VesselState, VesselWithHistory>({
//   name: 'vessel',
//   initialState,
//   thunks: {
//     fetchByIdThunk: fetchVesselByIdThunk,
//   },
// })

// export const { selectById } = entityAdapter.getSelectors<RootState>((state) => state.vessels)

// export const selectVesselById = memoize((vesselsToFetch: FetchVessel[]) =>
//   createSelector([(state: RootState) => state], (state) => selectById(state, vesselsToFetch))
// )
export default vesselsSlice.reducer
