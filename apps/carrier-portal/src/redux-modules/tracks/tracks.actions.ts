import { createAction } from 'typesafe-actions'
import { TrackInterface } from 'types/app.types'

export const fetchTrackInit = createAction('FETCH_TRACK_INIT')<{
  id: string
  startDate?: string
  endDate?: string
}>()

export const fetchTrackComplete = createAction('FETCH_TRACK_COMPLETE')<{
  id: string
  track: TrackInterface
}>()

export const fetchTrackError = createAction('FETCH_TRACK_ERROR')<{
  id: string
  error: string
}>()

const trackActions = {
  fetchTrackInit,
  fetchTrackComplete,
  fetchTrackError,
}

export default trackActions
