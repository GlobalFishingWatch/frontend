import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { stringify } from 'qs'
import { createSelector } from 'reselect'
import { AppState, AppActions } from 'types/redux.types'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import {
  hasVesselSelected,
  getDateRange,
  getVesselId,
  getRfmos,
  getFlags,
  getPorts,
  getEventType,
  getDurationRange,
  getHasVesselFilter,
  getEezs,
  getDataset,
  getDonorFlags,
} from 'redux-modules/router/route.selectors'
import { QueryParams } from 'types/app.types'
import { getDatasetError } from 'redux-modules/app/app.selectors'
import { EVENT_DURATION_RANGE, INFO_LINKS, EVENT_TYPES_CONFIG } from 'data/constants'
import Header from './header'

const getDownloadUrl = createSelector(
  [getEventType, hasVesselSelected, getDurationRange, getVesselId],
  (eventType, hasVesselSelected, durationRange, vessel) => {
    const params = stringify({
      timeFormat: 'timestamp',
      ...(hasVesselSelected ? { vessels: vessel } : { types: eventType }),
      ...(durationRange[0] !== EVENT_DURATION_RANGE[0] && { durationMin: durationRange[0] }),
      ...(durationRange[1] !== EVENT_DURATION_RANGE[1] && { durationMax: durationRange[1] }),
    })
    return `/events?${params}`
  }
)

const getDownloadFilteredUrl = createSelector(
  [getDownloadUrl, getRfmos, getDateRange, getPorts, getFlags, getDonorFlags, getEezs, getVesselId],
  (downloadUrl, rfmos, dateRange, ports, flags, donorFlags, eezs, vessel) => {
    const params = stringify(
      {
        startDate: dateRange.start,
        endDate: dateRange.end,
        ...(rfmos && { rfmos }),
        ...(flags && { flags }),
        ...(donorFlags && { donorFlags }),
        ...(ports && { nextPorts: ports }),
        ...(vessel && { vessels: vessel }),
        ...(eezs && { eezs: eezs }),
      },
      { arrayFormat: 'comma' }
    )
    return `${downloadUrl}${params ? `&${params}` : ''}`
  }
)

const getDatasetLabel = createSelector(
  [getEventType, getHasVesselFilter],
  (eventType, hasVesselSelected) => {
    if (hasVesselSelected) return 'vessel'
    return EVENT_TYPES_CONFIG.find(({ id }) => id === eventType)?.label || eventType
  }
)

const mapStateToProps = (state: AppState) => ({
  hasVessel: hasVesselSelected(state),
  hasDatasetError: getDatasetError(state) !== '',
  infoLinks: INFO_LINKS,
  datasetId: getDataset(state),
  datasetLabel: getDatasetLabel(state),
  downloadUrl: getDownloadFilteredUrl(state),
})

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
  setSearchFields: (query: QueryParams) => dispatch(updateQueryParams(query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
