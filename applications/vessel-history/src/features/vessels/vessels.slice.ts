import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import { Generators } from '@globalfishingwatch/layer-composer'
import { DataviewInstance } from '@globalfishingwatch/api-types/dist/dataviews'
import { VesselAPISource, VesselWithHistory } from 'types'
import {
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { VesselSourceId } from 'types/vessel'
import gfwThunk from 'features/vessels/sources/gfw.slice'
import tmtThunk from 'features/vessels/sources/tmt.slice'
import { RootState } from 'store'
import { mergeVesselFromSources } from './vessels.utils'
export interface VesselState extends AsyncReducer<VesselWithHistory> {
  dataview?: DataviewInstance<Generators.Type>
}
const initialState: VesselState = {
  ...asyncInitialState,
  dataview: undefined,
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

export const fetchVesselByIdThunk = createAsyncThunk(
  'vessels/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const [dataset, gfwId, tmtId] = id.split('_')
      const vesselsToFetch: FetchVessel[] = [
        {
          source: VesselAPISource.GFW,
          sourceId: {
            id: gfwId,
            dataset: dataset,
          },
        },
        {
          source: VesselAPISource.TMT,
          sourceId: {
            id: tmtId,
          },
        },
      ].filter(({ sourceId: { id } }) => id && id.toLowerCase() !== 'na')
      const vessels = await Promise.all(
        vesselsToFetch.map(async ({ source, sourceId }) => ({
          source,
          vessel: await getVesselFromSourceAPI(source).fetchById(sourceId),
        }))
      )
      return {
        ...mergeVesselFromSources(vessels),
        id,
      }
    } catch (e: any) {
      return rejectWithValue({ status: e.status || e.code, message: `${id} - ${e.message}` })
    }
  }
)

const { slice: vesselsSlice, entityAdapter } = createAsyncSlice<VesselState, VesselWithHistory>({
  name: 'vessels',
  initialState,
  thunks: {
    fetchByIdThunk: fetchVesselByIdThunk,
  },
  reducers: {
    clearVesselDataview: (state) => {
      state.dataview = undefined
      state.status = AsyncReducerStatus.Idle
    },
    upsertVesselDataview: (state, action: PayloadAction<DataviewInstance<Generators.Type>>) => {
      state.dataview = action.payload
    },
  },
})

export const { selectById, selectIds } = entityAdapter.getSelectors<RootState>(
  (state) => state.vessels
)

export const selectVesselById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => {
    return selectById(state, id)
  })
)

export const selectVessels = (state: RootState) => state.vessels.entities
export const selectVesselsStatus = (state: RootState) => state.vessels.status
export const selectVesselDataview = (state: RootState) => state.vessels.dataview

export const { clearVesselDataview, upsertVesselDataview } = vesselsSlice.actions

export default vesselsSlice.reducer
