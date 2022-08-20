import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import geobuf from 'geobuf'
import Pbf from 'pbf'
import { subMonths, addDays } from 'date-fns'
import { fetchAPI } from 'data/api'
import { AppState } from 'types/redux.types'
import {
  getEncounterEventVesselId,
  getCurrentEventDates,
} from 'redux-modules/vessel/vessel.selectors'
import { getDateRange, getVesselId, getDataset } from 'redux-modules/router/route.selectors'
import { getDatasetLoaded } from 'redux-modules/app/app.selectors'
import { getEncounterVesselTrack, getVesselTrack } from './tracks.selectors'
import { TrackReducerItem } from './tracks.reducer'
import { fetchTrackInit, fetchTrackComplete, fetchTrackError } from './tracks.actions'

const fetchTrack = async (
  datasetId,
  id: string,
  { start, end }: { start: string; end: string },
  dispatch: Dispatch
) => {
  const url = `/datasets/${datasetId}/vessels/${id}/tracks?startDate=${start}&endDate=${end}&binary=true`
  const data = await fetchAPI(url, dispatch, { responseType: 'arrayBuffer' }).then((buffer) => {
    return geobuf.decode(new Pbf(buffer))
  })
  return data
}

const trackNeedsFetch = (
  track: TrackReducerItem | null,
  dateRange: { start: string; end: string }
): boolean => {
  const { start, end } = dateRange
  const hasTrackLoaded = track !== null
  const isTrackLoading = track ? track.loading === true : false
  const hasDateRangeChanged = track ? track.startDate !== start || track.endDate !== end : false
  return (!hasTrackLoaded && !isTrackLoading) || hasDateRangeChanged
}

export const trackThunk = async (dispatch: Dispatch, getState: StateGetter<AppState>) => {
  const state = getState()
  const id = getVesselId(state)
  if (!id) return null

  const track = getVesselTrack(state)
  const dateRange = getDateRange(state)
  const dataset = getDataset(state)
  const isDatasetLoaded = getDatasetLoaded(state)

  if (dataset && isDatasetLoaded && trackNeedsFetch(track, dateRange)) {
    const { start, end } = dateRange
    dispatch(fetchTrackInit({ id, startDate: start, endDate: end }))
    try {
      const data = await fetchTrack(dataset, id, dateRange, dispatch)
      const track = { id, data }
      dispatch(fetchTrackComplete({ id, track }))
    } catch (e) {
      dispatch(fetchTrackError({ id, error: e }))
    }
  }
}

function getISOString(timestamp: number) {
  return new Date(timestamp).toISOString()
}

export const encounterTrackThunk = async (dispatch: Dispatch, getState: StateGetter<AppState>) => {
  const state = getState()
  const id = getEncounterEventVesselId(state)

  if (!id) return null

  const encounterTrack = getEncounterVesselTrack(state)
  const eventDates = getCurrentEventDates(state)

  if (!eventDates) return null

  const startEncounterDate = subMonths(eventDates.end, 1).getTime()
  const endEncounterDate = addDays(eventDates.end, 7).getTime()
  const dateRange = {
    start: getISOString(startEncounterDate),
    end: getISOString(endEncounterDate),
  }
  const dataset = getDataset(state)
  if (dataset && trackNeedsFetch(encounterTrack, dateRange)) {
    const { start, end } = dateRange
    dispatch(fetchTrackInit({ id, startDate: start, endDate: end }))
    try {
      const data = await fetchTrack(dataset, id, dateRange, dispatch)
      const track = { id, data }
      dispatch(fetchTrackComplete({ id, track }))
    } catch (e) {
      dispatch(fetchTrackError({ id, error: e }))
    }
  }
}
