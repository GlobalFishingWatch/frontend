import { connect, batch } from 'react-redux'
import { Dispatch } from 'redux'
import { AppState, AppActions } from 'types/redux.types'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import {
  getDateRange,
  getDurationRange,
  getSearchParamsWithLabel,
} from 'redux-modules/router/route.selectors'
import { saveLatestSearchs } from 'redux-modules/app/app.actions'
import { LatestSearch } from 'redux-modules/app/app.reducer'
import { getDatasetDates, getDatasetLoaded } from 'redux-modules/app/app.selectors'
import { DatasetDates } from 'types/app.types'
import { getVesselWithLabel } from 'redux-modules/vessel/vessel.selectors'
import { isDurationRangeDefault } from 'utils/events'
import { parseDurationRangeToString } from 'utils'
import {
  getFlagsOptions,
  getDonorFlagsOptions,
  getEezsWithCounter,
  getRfmoWithCounter,
  getPortOptions,
  getVesselptions,
} from './filters.selectors'
import Filters, { FiltersState } from './filters'

const mapStateToProps = (state: AppState) => ({
  vessel: getVesselWithLabel(state),
  flagsOptions: getFlagsOptions(state),
  donorFlagsOptions: getDonorFlagsOptions(state),
  eezOptions: getEezsWithCounter(state),
  rfmosOptions: getRfmoWithCounter(state),
  portsOptions: getPortOptions(state),
  vesselOptions: getVesselptions(state),
  isLoading: !getDatasetLoaded(state),
  datasetDates: getDatasetDates(state),
  filters: {
    dateRange: getDateRange(state),
    flag: getSearchParamsWithLabel('flag')(state),
    flagDonor: getSearchParamsWithLabel('flagDonor')(state),
    eez: getSearchParamsWithLabel('eez')(state),
    rfmo: getSearchParamsWithLabel('rfmo')(state),
    port: getSearchParamsWithLabel('port')(state),
    durationRange: getDurationRange(state),
  },
})

const getQueryFromState = (state: FiltersState, datasetDates: DatasetDates) => {
  const { dateRange, vessel, flag, flagDonor, eez, rfmo, port, durationRange } = state
  const { start, end } = dateRange

  return {
    start: start !== null && start !== datasetDates.start ? start : undefined,
    end: end !== null && end !== datasetDates.end ? end : undefined,
    vessel: vessel ? vessel.id : undefined,
    flag: flag !== null ? flag.map((f) => f.id) : undefined,
    flagDonor: flagDonor !== null ? flagDonor.map((f) => f.id) : undefined,
    eez: eez !== null ? eez.map((f) => f.id) : undefined,
    rfmo: rfmo !== null ? rfmo.map((f) => f.id) : undefined,
    port: port !== null ? port.map((f) => f.id) : undefined,
    duration: !isDurationRangeDefault(durationRange)
      ? parseDurationRangeToString(durationRange)
      : undefined,
  }
}

const getSelectionFromState = (state: FiltersState) => {
  const { vessel, flag, flagDonor, rfmo, eez, port, durationRange } = state
  const selection: LatestSearch[] = []
  if (vessel) {
    selection.push({ type: 'vessel', items: [{ id: vessel.id, label: vessel.label }] })
  }
  if (flag !== null) {
    selection.push({
      type: 'flag',
      items: flag.map((f) => ({ id: f.id, label: f.label })),
    })
  }
  if (flagDonor !== null) {
    selection.push({
      type: 'flagDonor',
      items: flagDonor.map((f) => ({ id: f.id, label: f.label })),
    })
  }
  if (rfmo !== null) {
    selection.push({
      type: 'rfmo',
      items: rfmo.map((rfmo) => ({ id: rfmo.id, label: rfmo.label })),
    })
  }
  if (eez !== null) {
    selection.push({
      type: 'eez',
      items: eez.map((eez) => ({ id: eez.id, label: eez.label })),
    })
  }
  if (port !== null) {
    selection.push({
      type: 'port',
      items: port.map((port) => ({ id: port.id, label: port.label })),
    })
  }
  if (durationRange !== null) {
    selection.push({
      type: 'duration',
      items: [{ id: durationRange.join('-'), label: 'duration' }],
    })
  }

  return selection
}

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
  setFiltersSelection: (state: FiltersState, datasetDates: DatasetDates) => {
    batch(() => {
      dispatch(saveLatestSearchs(getSelectionFromState(state)))
      dispatch(updateQueryParams(getQueryFromState(state, datasetDates)))
    })
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Filters)
