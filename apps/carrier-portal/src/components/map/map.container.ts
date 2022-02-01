import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { AppState, AppActions } from 'types/redux.types'
import { getVesselTrackBounds } from 'redux-modules/tracks/tracks.selectors'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import { getFiltersBounds } from 'pages/home/home.selectors'
import { getCurrentEventByTimestamp } from 'redux-modules/vessel/vessel.selectors'
import { MapDimensions } from 'redux-modules/app/app.reducer'
import { setMapDimensions } from 'redux-modules/app/app.actions'
import { getMapDimensions } from 'redux-modules/app/app.selectors'
import { getDateRange } from 'redux-modules/router/route.selectors'
import { getLayerComposerLayers } from './map.selectors'
import Map from './map'

const mapStateToProps = (state: AppState) => ({
  filtersBounds: getFiltersBounds(state),
  trackBounds: getVesselTrackBounds(state),
  generatorsConfig: getLayerComposerLayers(state),
  mapDimensions: getMapDimensions(state),
  dateRange: getDateRange(state),
  currentEvent: getCurrentEventByTimestamp(state),
})

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
  goToVesselEvent: (timestamp: number) => dispatch(updateQueryParams({ timestamp })),
  setMapDimensions: (mapDimensions: MapDimensions) => dispatch(setMapDimensions(mapDimensions)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)
