import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { RenderedVoyage } from 'types/voyage'

export interface VoyagesState {
  voyages: Record<number, RenderedVoyage>
  initialized: boolean
}
const initialState: VoyagesState = {
  voyages: {},
  initialized: false,
}

const voyagesSlice = createSlice({
  name: 'voyages',
  initialState,
  reducers: {
    upsertVesselVoyagesExpanded: (state, action: PayloadAction<RenderedVoyage>) => {
      const voyage = action.payload
      if (voyage && state.voyages[voyage.timestamp]) {
        state.voyages[voyage.timestamp].status =
          state.voyages[voyage.timestamp].status === 'expanded' ? 'collapsed' : 'expanded'
      } else {
        state.voyages[voyage.timestamp] = {
          ...voyage,
          status: 'expanded',
        }
      }
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

export const selectExpandedVoyages = (state: RootState) => state.voyages.voyages
export const selectVoyagesInitialized = (state: RootState) => state.voyages.initialized

export const { setVesselVoyagesInitialized, upsertVesselVoyagesExpanded } = voyagesSlice.actions

export default voyagesSlice.reducer
