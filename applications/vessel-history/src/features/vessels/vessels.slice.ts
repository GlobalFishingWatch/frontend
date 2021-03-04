import { createAsyncThunk } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { Vessel } from '@globalfishingwatch/api-types'
import { GFWDetail, TMTDetail, VesselAPISource } from 'types'
import { AsyncError, asyncInitialState, AsyncReducer } from 'utils/async-slice'
import { VesselSourceId } from 'types/vessel'
import gfwThunk from 'features/vessels/sources/gfw.slice'
import { RootState } from '../../store'
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
export type VesselState = AsyncReducer<Vessel>

const initialState: VesselState = {
  ...asyncInitialState,
}
export interface VesselAPIThunk {
  fetchById(id: VesselSourceId): Promise<Vessel>
}

const getVesselAPIThunkBySource: (source: VesselAPISource) => VesselAPIThunk = (
  source: VesselAPISource
) => {
  const thunks = {
    [VesselAPISource.GFW]: gfwThunk,
    [VesselAPISource.TMT]: gfwThunk,
  }
  return thunks[source]
}

export type FetchVessel = {
  source: VesselAPISource
  sourceId: VesselSourceId
}
const fetchVesselByIdThunk = createAsyncThunk<
  Vessel,
  FetchVessel[],
  {
    rejectValue: AsyncError
  }
>('vessels/fetchById', async (vesselsToFetch: FetchVessel[], { rejectWithValue }) => {
  try {
    const vessels = vesselsToFetch.map(async ({ source, sourceId }) => ({
      [source]: await getVesselAPIThunkBySource(source).fetchById(sourceId),
    }))

    return vessels.shift()
  } catch (e) {
    return rejectWithValue({
      status: e.status || e.code,
      message: `${id} - ${e.message}`,
    })
  }
})
