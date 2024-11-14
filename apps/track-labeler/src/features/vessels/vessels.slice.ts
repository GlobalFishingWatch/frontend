import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FeatureCollection } from '@turf/helpers'
import { Segment } from '@globalfishingwatch/data-transforms'
import { ExportData } from 'types'
import { RootState } from 'store'

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

export type TrackInterface = {
  id: string
  data: Segment[]
  startDate: string
  endDate: string
}
export interface TrackItem {
  loading: boolean
  error: string | null
  startDate?: string | null
  endDate?: string | null
  track: TrackInterface | null
}

export interface VesselInfo {
  id: string
  shipname?: string
  callsign: string
  flag?: string
  mmsi: string
  imo?: string
}

export interface Tracks {
  [key: string]: TrackItem
}

type VesselsSlice = {
  vessels: Dictionary<VesselInfo>
  tracks: Tracks
  originalTrack: Tracks
  events: Dictionary<any>
  searchableTimestamps: number[]
  importedData: ExportData | null
}

const initialState: VesselsSlice = {
  vessels: {},
  tracks: {},
  originalTrack: {},
  events: {},
  searchableTimestamps: [],
  importedData: null,
}

const slice = createSlice({
  name: 'vessels',
  initialState,
  reducers: {
    setVesselInfo: (state, action: PayloadAction<{ id: string; data: VesselInfo }>) => {
      state.vessels[action.payload.id] = action.payload.data
    },
    setImportedData: (state, action: PayloadAction<{ data: ExportData }>) => {
      state.importedData = action.payload.data

      const vesselId = action.payload.data.properties.vessel.id ?? 'NA'
      if (state.originalTrack[vesselId]) {
        delete state.originalTrack[vesselId]
      }
    },
    initVesselTrack: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const track = {
        ...action.payload.data,
        loading: true,
        error: null,
        track: null,
      } as TrackItem
      state.tracks[action.payload.id] = track
    },
    setVesselTrack: (state, action: PayloadAction<{ id: string; data: TrackInterface }>) => {
      const { id, startDate, endDate, data } = action.payload.data
      const track = {
        startDate,
        endDate,
        loading: false,
        error: null,
        track: {
          id,
          data,
        },
      } as TrackItem
      state.tracks[action.payload.id] = track

      const vesselId = action.payload.id ?? 'NA'
      if (!state.originalTrack[vesselId]) {
        state.originalTrack[vesselId] = track
      }
    },
    setSearchableTimstamps: (state, action: PayloadAction<{ id: string; data: Segment[] }>) => {
      if (action.payload.data) {
        state.searchableTimestamps = action.payload.data.flatMap((segment: Segment) => {
          return segment.map((record) => record.timestamp as number)
        })
      }
    },

    setVesselEvents: (state, action: PayloadAction<{ id: string; data: any }>) => {
      state.events[action.payload.id] = action.payload.data
    },
  },
})
export const {
  initVesselTrack,
  setVesselTrack,
  setVesselEvents,
  setVesselInfo,
  setImportedData,
  setSearchableTimstamps,
} = slice.actions
export default slice.reducer

export const selectVessels = (state: RootState) => state.vessels.vessels
export const selectTracks = (state: RootState) => state.vessels.tracks
export const selectOriginalTracks = (state: RootState) => state.vessels.originalTrack
export const selectEvents = (state: RootState) => state.vessels.events
export const selectImportedData = (state: RootState) => state.vessels.importedData
export const selectTimestamps = (state: RootState) => state.vessels.searchableTimestamps