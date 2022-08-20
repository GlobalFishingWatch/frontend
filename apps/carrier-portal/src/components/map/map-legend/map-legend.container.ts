import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { add, sub } from 'date-fns'
import { createSelector } from 'reselect'
import { AppState, AppActions } from 'types/redux.types'
import {
  getDateRange,
  getVesselId,
  getMapZoom,
  getMapViewport,
  hasVesselSelected,
  getDataset,
} from 'redux-modules/router/route.selectors'
import {
  getVesselDetailsData,
  getCurrentEventByTimestamp,
  getEncounterEventVesselId,
  getCurrentEventDates,
} from 'redux-modules/vessel/vessel.selectors'
import {
  getEncounterVesselTrackLoading,
  getVesselTrackGeometry,
  getVesselTrackLoading,
} from 'redux-modules/tracks/tracks.selectors'
import { getContextualLayers } from 'components/map/map.selectors'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import { CoordinatePosition } from 'types/app.types'
import { getMapDimensions, getDatasetData } from 'redux-modules/app/app.selectors'
import { TRACK_INSPECTOR_URL } from 'data/constants'
import MapLegend from './map-legend'

type WorkspaceDataview = {
  id: string
  datasetsParams?: { id: string; dataset: string }[]
  view?: Record<string, any>
}

const getDownloadUrl = (type: 'main' | 'encounter') => {
  const vesselSelector = type === 'main' ? getVesselId : getEncounterEventVesselId
  return createSelector(
    [vesselSelector, getDateRange, getDataset],
    (vesselId, dateRange, dataset): string => {
      const { start, end } = dateRange
      return `/datasets/${dataset}}/vessels/${vesselId}/tracks?startDate=${start}&endDate=${end}`
    }
  )
}

const getTrackInspectorLinkParams = createSelector(
  [
    getVesselId,
    getEncounterEventVesselId,
    getMapViewport,
    getContextualLayers,
    getCurrentEventByTimestamp,
    getCurrentEventDates,
    getDateRange,
    getDatasetData,
  ],
  (
    vesselId,
    encounterVesselId,
    mapViewport,
    contextualLayers,
    currentEvent,
    currentEventDates,
    dateRange,
    datasetData
  ): null | { baseUrl?: string; params: any } => {
    if (!vesselId || !datasetData) return null

    const dataset = datasetData.id

    const baseUrl = TRACK_INSPECTOR_URL
    if (!baseUrl) return null

    const currentEventId = currentEvent?.id as string | undefined

    const contextualLayersIds = contextualLayers
      // .filter((contextualLayer) => contextualLayer.visible)
      .map((contextualLayer) => ({
        id: contextualLayer.id,
        view: {
          visible: contextualLayer.visible,
        },
      }))

    // Base dataviews: bg, landmass, visible context layers, carrier track
    const workspaceDataviews: WorkspaceDataview[] = [
      { id: 'background' },
      { id: 'landmass' },
      ...contextualLayersIds,
      {
        id: 'trackCarrier',
        datasetsParams: [
          {
            id: vesselId,
            dataset,
          },
        ],
      },
    ]

    // add carrier events with selected event if found
    const eventsDataview: WorkspaceDataview = {
      id: 'eventsCarrier',
      datasetsParams: [
        {
          id: vesselId,
          dataset,
        },
      ],
    }
    if (currentEventId) {
      eventsDataview.view = { currentEventId }
    }
    workspaceDataviews.push(eventsDataview)

    // add fishing track + events if it appears
    const trackFishingDataview: WorkspaceDataview = {
      id: 'trackFishing',
      view: { visible: false },
    }
    const fishingEventsDataview: WorkspaceDataview = {
      id: 'eventsFishing',
      view: { visible: false },
    }
    if (encounterVesselId) {
      trackFishingDataview.datasetsParams = [
        {
          id: encounterVesselId,
          dataset,
        },
      ]
      trackFishingDataview.view = { visible: true }
      fishingEventsDataview.datasetsParams = [
        {
          id: encounterVesselId,
          dataset,
        },
      ]
      if (currentEventId) {
        // this is a hack to highlight the fishing vessel encounter event that matches the carrier encounter
        const fishingEncounterEventId = currentEventId.replace('.1', '.2')
        fishingEventsDataview.view = { visible: true, currentEventId: fishingEncounterEventId }
      }
    }
    workspaceDataviews.push(trackFishingDataview)
    workspaceDataviews.push(fishingEventsDataview)

    const start = currentEventDates
      ? sub(currentEventDates.start, { days: 30 }).toISOString()
      : dateRange.start
    const end = currentEventDates
      ? add(currentEventDates.end, { days: 7 }).toISOString()
      : dateRange.end

    const { latitude, longitude, zoom } = mapViewport
    const params = {
      start,
      end,
      zoom,
      latitude,
      longitude,
      timebarMode: encounterVesselId ? 'encounters' : 'events',
      workspaceDataviews,
    }
    return {
      baseUrl,
      params,
    }
  }
)

const mapStateToProps = (state: AppState) => ({
  zoom: getMapZoom(state),
  track: getVesselTrackGeometry(state),
  vessel: getVesselDetailsData(state),
  vesselId: getVesselId(state),
  hasVesselSelected: hasVesselSelected(state),
  currentEvent: getCurrentEventByTimestamp(state),
  mapDimensions: getMapDimensions(state),
  loadingVesselTrack: getVesselTrackLoading(state),
  loadingEncounterVesselTrack: getEncounterVesselTrackLoading(state),
  trackInspectorLinkParams: getTrackInspectorLinkParams(state),
  downloadLinks: {
    main: getDownloadUrl('main')(state),
    encounter: getDownloadUrl('encounter')(state),
  },
})

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
  setMapCoordinates: (coordinates: CoordinatePosition, zoom: number) =>
    dispatch(updateQueryParams({ ...coordinates, zoom })),
})

export default connect(mapStateToProps, mapDispatchToProps)(MapLegend)
