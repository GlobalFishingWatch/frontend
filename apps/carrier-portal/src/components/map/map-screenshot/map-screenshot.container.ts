import { connect } from 'react-redux'
import { Dispatch } from 'react'
import { createSelector } from 'reselect'
import { AppState, AppActions } from 'types/redux.types'
import { getMapDownloadVisible } from 'redux-modules/app/app.selectors'
import { setMapDownloadVisible } from 'redux-modules/app/app.actions'
import {
  getVesselDetailsData,
  getEncounterEventVessel,
} from 'redux-modules/vessel/vessel.selectors'
import {
  ENCOUNTER_TYPES,
  EVENTS_COLORS,
  EVENT_TYPES,
  LOITERING_TYPES,
  SEARCH_TYPES,
} from 'data/constants'
import {
  hasVesselSelected,
  getSearchFields,
  getDateRangeLiteral,
} from 'redux-modules/router/route.selectors'
import { parseSelectionToInput } from 'components/search/search.utils'
import { getCurrentEventMapLayer } from '../map.selectors'
import MapScreenshot from './map-screenshot'

export const getVesselEvents = createSelector([hasVesselSelected], (vesselSelected) => {
  if (!vesselSelected) return null
  return [
    {
      id: 'loitering',
      label: 'Loitering event',
      color: EVENTS_COLORS.loitering,
    },
    {
      id: 'port',
      label: 'Port visit',
      color: EVENTS_COLORS.port,
    },
  ]
})

export const getCurrentFilters = createSelector([getSearchFields], (searchFields) => {
  if (!searchFields) return ''
  const filteredSearchFields = searchFields.filter(
    ({ type }) =>
      type !== SEARCH_TYPES.end && type !== SEARCH_TYPES.start && type !== SEARCH_TYPES.vessel
  )
  return parseSelectionToInput(filteredSearchFields)
})

export const getCurrentEventsByType = createSelector(
  [getCurrentEventMapLayer, hasVesselSelected],
  (currentEventMapLayer, vesselSelected) => {
    if (!currentEventMapLayer || !currentEventMapLayer.active) return null
    return currentEventMapLayer.id === EVENT_TYPES.encounter || vesselSelected
      ? Object.values(ENCOUNTER_TYPES).map((encounter) => ({
          ...encounter,
          label: `${encounter.label} encounter`,
        }))
      : LOITERING_TYPES
  }
)

const mapStateToProps = (state: AppState) => ({
  visible: getMapDownloadVisible(state),
  vessel: getVesselDetailsData(state),
  encounterVessel: getEncounterEventVessel(state),
  currentEvents: getCurrentEventsByType(state),
  otherEvents: getVesselEvents(state),
  filters: getCurrentFilters(state),
  dateRangeLiteral: getDateRangeLiteral(state),
})

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
  setMapDownloadVisible: (visible: boolean) => dispatch(setMapDownloadVisible(visible)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MapScreenshot)
