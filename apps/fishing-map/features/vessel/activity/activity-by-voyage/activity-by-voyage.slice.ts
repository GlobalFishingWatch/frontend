import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { RenderedVoyage } from 'types/voyage'

export interface VoyagesState {
  voyages: number[]
}
const initialState: VoyagesState = {
  voyages: [],
}

const voyagesSlice = createSlice({
  name: 'voyages',
  initialState,
  reducers: {
    upsertVesselVoyagesExpanded: (state, action: PayloadAction<RenderedVoyage>) => {
      const voyage = action.payload
      const index = state.voyages.indexOf(voyage.timestamp)
      if (index === -1) {
        state.voyages.push(voyage.timestamp)
      } else {
        state.voyages.splice(index, 1)
      }
    },
  },
})

export const selectExpandedVoyages = (state: RootState) => state.voyages.voyages

export const { upsertVesselVoyagesExpanded } = voyagesSlice.actions

export default voyagesSlice.reducer
