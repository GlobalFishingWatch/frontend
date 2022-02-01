import { createSelector } from 'reselect'
import add from 'date-fns/add'
import {
  formatUTCDate,
  getFieldLabel,
  parseQueryToSearchFields,
  parseDurationRangeToArray,
} from 'utils'
import { QueryTransformation } from 'store'
import { AppState } from 'types/redux.types'
import { DEFAULT_FILTERS, SEARCH_TYPES, EVENT_TYPES, TEXT_DATETIME_FORMAT12 } from 'data/constants'
import { QueryParam, SearchTypes, EventsFilter, SearchItemType } from 'types/app.types'
import { getDatasetDates, getStaticConfig } from 'redux-modules/app/app.selectors'
import { getCurrentEventByTimestampFn } from 'redux-modules/vessel/vessel.selectors'

const getLocation = (state: AppState) => state.location

export const getLocationPath = createSelector([getLocation], (location) => {
  return location.pathname
})
export const getLocationQuery = createSelector([getLocation], (location) => {
  return location.query
})
export const getLocationSearch = createSelector([getLocation], (location) => {
  return location.search
})
export const getLocationType = createSelector([getLocation], (location) => {
  return location.type
})

const queryParamTransformations: QueryTransformation[] = [
  { key: 'start', transformation: (value: string) => new Date(value).toISOString() },
  {
    key: 'end',
    // to use always the end of the day
    transformation: (value: string) =>
      add(new Date(value), {
        hours: 23,
        minutes: 59,
        seconds: 59,
      }).toISOString(),
  },
]

export const getQueryParam = (param: QueryParam) =>
  createSelector([getLocationQuery, getDatasetDates], (query, datasetDates) => {
    if (query === undefined || query[param] === undefined) {
      if (param === 'start') {
        return datasetDates.start
      } else if (param === 'end') {
        return datasetDates.end
      } else if (param === 'eventType') {
        if (query && query.layer) {
          const currentEventLayer = (query.layer as any).find(
            (l: string) => l === EVENT_TYPES.encounter || l === EVENT_TYPES.loitering
          )
          if (currentEventLayer) {
            return currentEventLayer
          }
        }
        return DEFAULT_FILTERS[param]
      }
      return DEFAULT_FILTERS[param]
    }

    const queryParamTransformation = queryParamTransformations.find((trans) => trans.key === param)
    if (queryParamTransformation) return queryParamTransformation.transformation(query[param])

    return query[param]
  })

export const getEventType = getQueryParam('eventType')
export const getTab = getQueryParam('tab')
export const getCurrentGraph = getQueryParam('graph')
export const getEezs = getQueryParam('eez')
export const getDuration = getQueryParam('duration')
export const getRfmos = getQueryParam('rfmo')
export const getFlags = getQueryParam('flag')
export const getDonorFlags = getQueryParam('flagDonor')
export const getVesselId = getQueryParam('vessel')
export const getStartDate = getQueryParam('start')
export const getEndDate = getQueryParam('end')
export const getLayers = getQueryParam('layer')
export const getPorts = getQueryParam('port')
export const getDataset = getQueryParam('dataset')
export const getMapZoom = createSelector([getQueryParam('zoom')], (zoom) => parseFloat(zoom))

export const getMapCoordinates = createSelector(
  [getQueryParam('latitude'), getQueryParam('longitude')],
  (lat, lon) => ({ latitude: parseFloat(lat), longitude: parseFloat(lon) })
)

export const getMapViewport = createSelector(
  [getMapCoordinates, getMapZoom],
  ({ latitude, longitude }, zoom) => ({
    latitude,
    longitude,
    zoom,
  })
)

export const getTimestamp = createSelector([getQueryParam('timestamp')], (timestamp) =>
  timestamp !== null ? parseInt(timestamp) : null
)

export const getTimestampWithByVessel = createSelector(
  [getTimestamp, getVesselId],
  (timestamp, vessel) => ({ timestamp, vessel })
)

export const getSearchFields = createSelector(
  [getLocationQuery, getStaticConfig],
  (query, staticConfig): SearchItemType[] | null => {
    if (query === undefined || !staticConfig) return null
    const searchFields = parseQueryToSearchFields(query, staticConfig)
    return searchFields
  }
)

export const getSearchParamsWithLabel = (param: SearchTypes) =>
  createSelector([getQueryParam(param), getStaticConfig], (paramValues, staticConfig) => {
    if (paramValues === null || !staticConfig) return null
    const paramSelection = paramValues.map((value: string) => ({
      id: value,
      label: getFieldLabel({ value, type: SEARCH_TYPES[param] }, staticConfig),
    }))

    return paramSelection
  })

export const hasVesselSelected = createSelector([getVesselId], (vessel): boolean => {
  return vessel !== null
})

export const getDurationRange = createSelector([getDuration], (duration = '') => {
  return parseDurationRangeToArray(duration)
})

export const getDateRange = createSelector([getStartDate, getEndDate], (start, end) => ({
  start,
  end,
}))

export const getDateRangeTS = createSelector([getStartDate, getEndDate], (start, end) => ({
  start: new Date(start).getTime(),
  end: new Date(end).getTime(),
}))

export const getDateRangeLiteral = createSelector(
  [getStartDate, getEndDate, getCurrentEventByTimestampFn],
  (start, end, currentEvent) => {
    const literal = `Activity Between ${formatUTCDate(start)} and ${formatUTCDate(end)}`
    if (!currentEvent) return literal

    const eventLiteral = currentEvent
      ? `Highlighted ${currentEvent.type} event between ${formatUTCDate(
          currentEvent.start,
          TEXT_DATETIME_FORMAT12
        )} and ${formatUTCDate(currentEvent.end, TEXT_DATETIME_FORMAT12)} UTC`
      : ''
    return `${literal}\n${eventLiteral}`
  }
)

export const isDefaultStartDate = createSelector(
  [getDatasetDates, getStartDate],
  (datasetDates, startDate) => datasetDates.start === startDate
)

export const isDefaultEndDate = createSelector(
  [getDatasetDates, getEndDate],
  (datasetDates, endDate) => datasetDates.end === endDate
)

export const getEventFilters = createSelector(
  [getRfmos, getEezs, getPorts, getFlags, getDonorFlags, getDateRangeTS, getDurationRange],
  (rfmos, eezs, ports, flags, donorFlags, dateRange, durationRange): EventsFilter => {
    return { rfmos, eezs, ports, flags, donorFlags, dateRange, durationRange }
  }
)

// whether current filter selection has an impact on vessel selection (excludes time filters)
export const getHasVesselFilter = createSelector([getSearchFields], (searchFields): boolean => {
  if (searchFields === null) {
    return false
  }

  const types = searchFields.map((f) => f.type)
  if (types.filter((t) => t !== 'start' && t !== 'end').length === 0) {
    return false
  }

  return true
})
