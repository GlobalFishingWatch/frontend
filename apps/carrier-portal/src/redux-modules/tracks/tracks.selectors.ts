import { createSelector } from 'reselect'
import turfBbox from '@turf/bbox'
import { getGeojsonBetweenTimestamps } from 'utils/map'
import { AppState } from 'types/redux.types'
import {
  getVesselTimelineEvents,
  getEncounterEventVesselId,
} from 'redux-modules/vessel/vessel.selectors'
import { TrackGeometry } from 'types/app.types'
import { getQueryParam, getDateRangeTS, hasVesselSelected } from '../router/route.selectors'

const getTracks = (state: AppState) => state.tracks

export const getVesselTrack = createSelector(
  [getTracks, getQueryParam('vessel')],
  (tracks, vessel) => {
    return tracks[vessel] !== undefined ? tracks[vessel] : null
  }
)

export const getVesselTrackLoading = createSelector([getVesselTrack], (trackData) => {
  return trackData !== null ? trackData.loading : true
})

export const getVesselTrackData = createSelector([getVesselTrack], (trackData) => {
  return trackData !== null ? trackData.track : null
})

export const getVesselTrackGeometry = createSelector([getVesselTrackData], (track) => {
  return track !== null ? track.data : null
})

export const getVesselTrackBounds = createSelector([getVesselTrackGeometry], (track) => {
  if (!track || !track.features || !track.features.length) return null

  const bounds = turfBbox(track)
  const [minLng, minLat, maxLng, maxLat] = bounds
  return { minLng, minLat, maxLng, maxLat }
})

export const getEncounterVesselTrack = createSelector(
  [getTracks, getEncounterEventVesselId],
  (tracks, encounterVesselId) => {
    if (!encounterVesselId) return null
    return tracks[encounterVesselId] !== undefined ? tracks[encounterVesselId] : null
  }
)

export const getEncounterVesselTrackLoading = createSelector(
  [getEncounterVesselTrack],
  (trackData) => {
    return trackData !== null ? trackData.loading : true
  }
)

const filterTrackGeometries = (track: TrackGeometry) => ({
  ...track,
  features: track.features.filter(
    (feature) => feature.properties && feature.properties.type === 'track'
  ),
})

export const getEncounterVesselTrackGeojson = createSelector(
  [getEncounterVesselTrack],
  (encounterTrack) => {
    if (!encounterTrack || !encounterTrack.track || !encounterTrack.track.data) {
      return null
    }
    return filterTrackGeometries(encounterTrack.track.data)
  }
)

export const getVesselTrackGeojsonByDateRange = createSelector(
  [getVesselTrackGeometry, getDateRangeTS],
  (track, dateRange) => {
    if (!track) return null
    const trackGeojson = filterTrackGeometries(track)
    return getGeojsonBetweenTimestamps(trackGeojson, dateRange.start, dateRange.end)
  }
)

export const getTrackEventsGeojson = createSelector(
  [hasVesselSelected, getVesselTimelineEvents],
  (hasVessel, events) => {
    if (!events || !hasVessel) return null
    return events
  }
)
