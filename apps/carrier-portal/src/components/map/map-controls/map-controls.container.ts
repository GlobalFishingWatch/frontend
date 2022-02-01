import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { Dispatch } from 'react'
import { AppState, AppActions } from 'types/redux.types'
import { getLayers, getMapZoom, hasVesselSelected } from 'redux-modules/router/route.selectors'
import { CONTEXT_LAYERS, CONTEXT_LAYERS_IDS } from 'data/constants'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import { LayerTypes } from 'types/app.types'
import { setMapDownloadVisible } from 'redux-modules/app/app.actions'
import { getEventsLoading, getEventsLoaded } from 'redux-modules/events/events.selectors'
import { getVesselEventsLoaded } from 'redux-modules/vessel/vessel.selectors'
import { getVesselTrackLoading } from 'redux-modules/tracks/tracks.selectors'
import { getCurrentEventMapLayer } from '../map.selectors'
import MapControls from './map-controls'

const getContextualLayers = createSelector(
  [getLayers, getCurrentEventMapLayer, hasVesselSelected],
  (layers, eventsLayer, hasVessel) => {
    const eventTypeLabel = eventsLayer ? eventsLayer.label.toLowerCase() : ''
    const contextualLayers = CONTEXT_LAYERS.map((layer) => ({
      ...layer,
      label: layer.label.replace('{{eventType}}', eventTypeLabel),
      ...(layer.description && {
        description: layer.description.replace('{{eventType}}', eventTypeLabel),
      }),
      active: layers !== null && layers.includes(layer.id),
      disabled:
        ((layer.id === CONTEXT_LAYERS_IDS.heatmap || layer.id === CONTEXT_LAYERS_IDS.nextPort) &&
          hasVessel) ||
        false,
    }))
    return eventsLayer ? [eventsLayer, ...contextualLayers] : contextualLayers
  }
)

const getDownloadReady = createSelector(
  [
    hasVesselSelected,
    getVesselEventsLoaded,
    getVesselTrackLoading,
    getEventsLoaded,
    getEventsLoading,
  ],
  (vesselSelected, vesselEventsLoaded, vesselTrackLoading, eventsLoaded, eventsLoading) => {
    if (vesselSelected) {
      return vesselEventsLoaded && !vesselTrackLoading
    }
    return eventsLoaded && !eventsLoading
  }
)

const mapStateToProps = (state: AppState) => ({
  zoom: getMapZoom(state),
  layers: getContextualLayers(state),
  hasVesselSelected: hasVesselSelected(state),
  downloadReady: getDownloadReady(state),
})

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
  setMapZoom: (zoom: number) => dispatch(updateQueryParams({ zoom })),
  setMapDownloadVisible: (visible: boolean) => dispatch(setMapDownloadVisible(visible)),
  setLayersActive: (layers: LayerTypes[]) => dispatch(updateQueryParams({ layer: layers })),
})

export default connect(mapStateToProps, mapDispatchToProps)(MapControls)
