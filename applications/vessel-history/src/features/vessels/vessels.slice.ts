import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FeatureCollection } from '@turf/helpers'
import { VesselInfo } from 'types'
import { RootState } from '../../store'

interface Dictionary<T> {
  [Key: string]: T
}

type VesselsSlice = {
  vessels: Dictionary<VesselInfo>
  events: Dictionary<any>
}

const initialState: VesselsSlice = {
  vessels: {},
  events: {},
}

const slice = createSlice({
  name: 'vessels',
  initialState,
  reducers: {
    setVesselInfo: (state, action: PayloadAction<{ id: string; data: VesselInfo }>) => {
      state.vessels[action.payload.id] = action.payload.data
    },

    setVesselEvents: (state, action: PayloadAction<{ id: string; data: any }>) => {
      state.events[action.payload.id] = action.payload.data
    },
  },
})
export const { setVesselEvents, setVesselInfo } = slice.actions
export default slice.reducer

export const selectVessels = (state: RootState) => state.vessels.vessels
export const selectEvents = (state: RootState) => state.vessels.events
