import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GFWDetail, TMTDetail } from 'types'
import { RootState } from '../../store'

export type IVesselInfo = {
  gfwData: GFWDetail | null
  tmtData: TMTDetail | null
}

interface Dictionary<T> {
  [Key: string]: T
}

type VesselsSlice = {
  vessels: Dictionary<IVesselInfo>
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
    setVesselInfo: (state, action: PayloadAction<{ id: string; data: IVesselInfo }>) => {
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
