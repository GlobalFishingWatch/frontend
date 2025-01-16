import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import type { RootState } from 'store'
import type { VesselWithHistory } from 'types';

import { parseAPIErrorMessage, parseAPIErrorStatus } from '@globalfishingwatch/api-client'
import type { DataviewInstance } from '@globalfishingwatch/api-types'
import type { GeneratorType } from '@globalfishingwatch/layer-composer'

import gfwThunk from 'features/vessels/sources/gfw.slice'
import tmtThunk from 'features/vessels/sources/tmt.slice'
import { VesselAPISource } from 'types'
import type { VesselSourceId } from 'types/vessel'
import type { RenderedVoyage } from 'types/voyage'
import type {
  AsyncReducer} from 'utils/async-slice';
import {
  asyncInitialState,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'

import { mergeVesselFromSources, NOT_AVAILABLE } from './vessels.utils'

export type VoyagesState = {
  expanded: Record<number, RenderedVoyage | undefined>
  initialized?: boolean
}
export interface VesselState extends AsyncReducer<VesselWithHistory> {
  dataview?: DataviewInstance<GeneratorType>
  voyages: Record<string, VoyagesState>
}
const initialState: VesselState = {
  ...asyncInitialState,
  dataview: undefined,
  voyages: {},
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
type FetchIds = {
  id: string
  akas?: string[]
}
export const fetchVesselByIdThunk = createAsyncThunk(
  'vessels/fetchById',
  async (idData: FetchIds, { rejectWithValue }) => {
    const id = idData.id
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
      ]
      if (idData.akas) {
        idData.akas.forEach((akaId) => {
          const [akaDataset, akaGfwId, akaTmtId] = akaId.split('_')
          vesselsToFetch.push(
            {
              source: VesselAPISource.GFW,
              sourceId: {
                id: akaGfwId,
                dataset: akaDataset,
              },
            },
            {
              source: VesselAPISource.TMT,
              sourceId: {
                id: akaTmtId,
              },
            }
          )
        })
      }
      const vesselsToFetchFiltered = Array.from(
        new Map(vesselsToFetch.map((item) => [item.sourceId.id, item])).values()
      ).filter(
        ({ sourceId: { id } }) => id && id.toLowerCase() !== NOT_AVAILABLE.toLocaleLowerCase()
      )

      const vessels = await Promise.all(
        vesselsToFetchFiltered.map(async ({ source, sourceId }) => {
          const vesselResult = await getVesselFromSourceAPI(source).fetchById(sourceId)
          if (vesselResult) {
            return {
              source,
              vessel: vesselResult,
            }
          }
          return undefined
        })
      )

      return {
        ...mergeVesselFromSources(vessels.filter((v) => v)),
        id: [id, ...(idData.akas ?? [])].join('|'),
      }
    } catch (e: any) {
      return rejectWithValue({
        status: parseAPIErrorStatus(e),
        message: `${id} - ${parseAPIErrorMessage(e)}`,
      })
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
    upsertVesselDataview: (state, action: PayloadAction<DataviewInstance<GeneratorType>>) => {
      state.dataview = action.payload
    },
    upsertVesselVoyagesExpanded: (
      state,
      action: PayloadAction<Record<string, Record<number, RenderedVoyage | undefined>>>
    ) => {
      const entries = Object.entries(action.payload)

      entries
        .map(([id, expanded]) => ({
          id,
          updates: {
            ...(state.voyages[id] ?? {}),
            expanded,
          },
        }))
        .forEach(({ id, updates }) => {
          state.voyages[id] = updates
        })
    },
    setVesselVoyagesInitialized: (state, action: PayloadAction<Record<string, boolean>>) => {
      const entries = Object.entries(action.payload)

      entries
        .map(([id, initialized]) => ({
          id,
          updates: {
            ...(state.voyages[id] ?? {}),
            initialized,
          },
        }))
        .forEach(({ id, updates }) => {
          state.voyages[id] = updates as any
        })
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
export const selectVesselVoyages = (state: RootState) => state.vessels.voyages

export const {
  clearVesselDataview,
  upsertVesselDataview,
  setVesselVoyagesInitialized,
  upsertVesselVoyagesExpanded,
} = vesselsSlice.actions

export default vesselsSlice.reducer
