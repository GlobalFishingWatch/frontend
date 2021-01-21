import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FeatureCollection } from '@turf/helpers'
import { RootState } from '../../store'

interface Dictionary<T> {
  [Key: string]: T
}

export type VesselDynamicField = {
  start: string
  end: string
  value: string
}

export type Vessel = {
  id: string
  name: string
  imo?: string
  flags?: VesselDynamicField[]
  lastFlag?: string
  mmsi?: VesselDynamicField[]
  lastMMSI?: string
}
export type CoordinateProperties = {
  id: string
  type: string
  coordinateProperties: {
    times: number[]
  }
}

export type TrackGeometry = FeatureCollection<any, CoordinateProperties>

export interface VesselInfo {
  id: string
  shipname?: string
  callsign: string
  flag?: string
  mmsi: string
  imo?: string
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
