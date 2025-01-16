import type { StateGetter } from 'redux-first-router'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { TrackPoint, TrackSegment } from '@globalfishingwatch/api-types'
import { trackValueArrayToSegments } from '@globalfishingwatch/data-transforms'

import { TRACK_FIELDS } from '../../data/config'
import type {
  TrackItem} from '../../features/vessels/vessels.slice';
import {
  initVesselTrack,
  selectImportedData,
  selectTracks,
  setSearchableTimstamps,
  setVesselTrack,
} from '../../features/vessels/vessels.slice'
import { updateQueryParams } from '../../routes/routes.actions'
import {
  getDateRange,
  selectIsImportView,
  selectProject,
  selectVessel,
} from '../../routes/routes.selectors'
import type { AppDispatch } from '../../store'
import type { AppState } from '../../types/redux.types'

import type { ExportData, ExportFeature } from './../../types/index'

const fetchTrack = async (
  dataset: string,
  id: string,
  { start, end }: { start: Date; end: Date }
) => {
  if (!start || !end) {
    return []
  }

  const trackFields = Object.assign([], TRACK_FIELDS)
  const url = `/v1/vessels/${id}/tracks?startDate=${start}&endDate=${end}&binary=true&fields=${trackFields}&format=valueArray&wrapLongitudes=false&datasets=${dataset}`
  const data = await GFWAPI.fetch<number[]>(url, { responseType: 'vessel' }).then((data) => {
    const segments = trackValueArrayToSegments(data, trackFields)
    return segments
  })

  return data
}

/**
 * This function verify is a request to get a new track is needed
 * @param id vessel id
 * @param track
 * @param dateRange
 */
const trackNeedsFetch = (
  id: string,
  track: TrackItem | null,
  dateRange: { start: string; end: string }
): boolean => {
  const { start, end } = dateRange
  const hasTrackLoaded = track !== null
  const isTrackLoading = track ? track.loading === true : false
  const hasDateRangeChanged =
    track && track.startDate && track.endDate
      ? track.startDate > start || track.endDate < end
      : false
  return !track || (!hasTrackLoaded && !isTrackLoading) || hasDateRangeChanged
}

const importedTrackNeedsFetch = (id: string, track: TrackItem | null): boolean => {
  const hasTrackLoaded = track !== null
  const isTrackLoading = track ? track.loading === true : false

  return !track || (!hasTrackLoaded && !isTrackLoading)
}

/**
 * This transform fuction converts a geojson into Segments
 * TODO: Make this function more generic to push to the monorepo
 *
 * @param geojson ExportData
 *
 * @returns Segment[]
 */
const geojsonToSegments = (geojson: ExportData): TrackSegment[] => {
  const segments: TrackSegment[] = geojson.features.map((feature: ExportFeature) => {
    const points: TrackPoint[] = feature.geometry.coordinates.map(
      (coordinate: (number | undefined | null)[], index: number) => {
        return {
          course: feature.properties.coordinateProperties.course
            ? feature.properties.coordinateProperties.course[index]
            : null,
          latitude: coordinate[1],
          longitude: coordinate[0],
          speed: feature.properties.coordinateProperties.speed[index],
          elevation: feature.properties.coordinateProperties.elevation
            ? feature.properties.coordinateProperties.elevation[index]
            : null,
          timestamp: feature.properties.coordinateProperties.times[index],
        } as TrackPoint
      }
    )
    return points
  })
  return segments
}

const extractTrackData = (geojson: ExportData /*, fields_: Field[]*/): any => {
  const start = new Date(geojson.features[0].properties.coordinateProperties.times[0] as number)
  const end = new Date(
    geojson.features[geojson.features.length - 1].properties.coordinateProperties.times[
      geojson.features[geojson.features.length - 1].properties.coordinateProperties.times.length - 1
    ] as number
  )
  const data = {
    start: start.toISOString(),
    end: end.toISOString(),
    vesselId: geojson.properties.vessel.id,
    vessel: geojson.properties.vessel,
  }
  return data
}

/**
 * Get a new track when the date filter change
 * @param dispatch
 * @param getState
 */
export const trackThunk = async (dispatch: AppDispatch, getState: StateGetter<AppState>) => {
  const state = getState()
  const id = selectVessel(state)
  const project = selectProject(state)
  const isImportView = selectIsImportView(state)
  const importedData = selectImportedData(state)
  if (isImportView && importedData) {
    // If a geojson was uploaded...
    const track = selectTracks(state)
    if (importedTrackNeedsFetch(id, track[id])) {
      const { start, end, vesselId } = extractTrackData(importedData)
      if (!id || id !== vesselId) {
        dispatch(updateQueryParams({ start: start, end: end, vessel: vesselId }))
        const initTrack = { id: vesselId, startDate: start, endDate: end }
        dispatch(
          initVesselTrack({
            id: vesselId,
            data: initTrack,
          })
        )
        const segments = geojsonToSegments(importedData)
        const track = { id: vesselId, startDate: start, endDate: end, data: segments }
        dispatch(
          setVesselTrack({
            id: vesselId,
            data: track,
          })
        )
        dispatch(
          setSearchableTimstamps({
            id: id,
            data: track.data,
          })
        )
      }
    }
    return null
  }

  //Continue the normal flow to get info from the api
  if (!id || !project) return null

  const track = selectTracks(state)
  const dateRange = getDateRange(state)
  if (trackNeedsFetch(id, track[id], dateRange)) {
    const { start, end } = dateRange
    const track = { id, startDate: start, endDate: end }
    dispatch(
      initVesselTrack({
        id: id,
        data: track,
      })
    )
    try {
      const data = await fetchTrack(project.dataset, id, dateRange)
      const track = { id, startDate: start, endDate: end, data }
      dispatch(
        setVesselTrack({
          id: id,
          data: track,
        })
      )
      dispatch(
        setSearchableTimstamps({
          id: id,
          data: track.data ?? [],
        })
      )
    } catch (e) {
      //dispatch(fetchTrackError({ id, error: e }))
    }
  }
}
