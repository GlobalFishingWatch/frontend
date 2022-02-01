import { createReducer } from 'typesafe-actions'
import { TrackInterface } from 'types/app.types'
import { fetchTrackInit, fetchTrackComplete, fetchTrackError } from './tracks.actions'

export interface TrackReducerItem {
  loading: boolean
  error: string | null
  startDate?: string | null
  endDate?: string | null
  track: TrackInterface | null
}

interface TracksReducer {
  [key: string]: TrackReducerItem
}
const initialState: TracksReducer = {}

export default createReducer(initialState)
  .handleAction(fetchTrackInit, (state, action) => {
    const { id, startDate, endDate } = action.payload
    const track = {
      ...state[id],
      startDate,
      endDate,
      loading: true,
      track: null,
    }
    return { ...state, [id]: track }
  })
  .handleAction(fetchTrackComplete, (state, action) => {
    const currentTrack = state[action.payload.id]
    const track = {
      ...currentTrack,
      error: null,
      loading: false,
      track: action.payload.track,
    }
    return { ...state, [action.payload.id]: track }
  })
  .handleAction(fetchTrackError, (state, action) => {
    const currentTrack = state[action.payload.id]
    const track = {
      ...currentTrack,
      track: null,
      loading: false,
      error: action.payload.error,
    }
    return { ...state, [action.payload.id]: track }
  })
