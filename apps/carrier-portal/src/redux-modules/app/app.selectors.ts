import { createSelector } from 'reselect'
import flatMap from 'lodash/flatMap'
import orderBy from 'lodash/orderBy'
import { subSeconds } from 'date-fns'
import { AppState } from 'types/redux.types'
import { SearchTypes, EventType } from 'types/app.types'
import { SelectOptions } from 'components/filters/select/select'
import { DEFAULT_FILTERS, SELECT_GROUPS } from 'data/constants'
import { getVesselWithLabelFn } from 'redux-modules/vessel/vessel.selectors'

const getConfig = (state: AppState) => state.app.config
const getErrorConfig = (state: AppState) => state.app.errorConfig
const getDataset = (state: AppState) => state.app.dataset
const getLoadingConfig = (state: AppState) => state.app.loadingConfig
const getLoadingDataset = (state: AppState) => state.app.loadingDataset
const getLatestSearchs = (state: AppState) => state.app.latestSearchs
const getMapState = (state: AppState) => state.app.map
const getSidebar = (state: AppState) => state.app.sidebarSize

// Had to duplicated it here to avoid circular dependencies
// https://decembersoft.com/posts/error-selector-creators-expect-all-input-selectors-to-be-functions/
export const getEventType = createSelector(
  [(state: AppState) => state.location.query],
  (query): EventType => {
    const param = 'eventType'
    return query !== undefined && query[param] ? query[param] : DEFAULT_FILTERS[param]
  }
)

export const getDatasetError = createSelector(
  [(state: AppState) => state.app.errorDataset],
  (error) => error
)

export const getMapDownloadVisible = createSelector([getMapState], (map) => map.mapDownloadVisible)
export const getMapDimensions = createSelector([getMapState], (map) => map.dimensions)
export const getSidebarSize = createSelector([getSidebar], (sidebarSize) => sidebarSize)
export const getConfigData = createSelector([getConfig], (config) => config || null)
export const getConfigError = createSelector([getErrorConfig], (error) => error || null)
export const getConfigLoading = createSelector([getLoadingConfig], (loading) => loading === true)
export const getDatasetData = createSelector([getDataset], (dataset) => dataset || null)

export const getDatasetDates = createSelector([getDatasetData], (dataset) => {
  return {
    start: dataset ? dataset.startDate : DEFAULT_FILTERS.start,
    end: dataset ? subSeconds(new Date(dataset.endDate), 1).toISOString() : DEFAULT_FILTERS.end,
  }
})

export const getDatasetLoading = createSelector([getLoadingDataset], (loading) => loading === true)

export const getDatasetLoaded = createSelector(
  [getLoadingDataset, getDatasetData],
  (loading, data) => loading === false && data !== null
)

export const getDatasetSupportedEvents = createSelector([getDatasetData], (dataset) =>
  dataset ? dataset.supportedEventTypes : null
)

export const getLatestSearchsByType = (type: SearchTypes) =>
  createSelector([getLatestSearchs], (latestSearchs): SelectOptions[] | undefined => {
    return latestSearchs !== null
      ? orderBy(
          flatMap(
            latestSearchs.filter((search) => search.type === type),
            (searchType) =>
              searchType.items.map((s) => ({
                id: s.id,
                label: s.label,
                icon: 'recent',
                group: SELECT_GROUPS.recent,
              }))
          ),
          'label'
        )
      : undefined
  })

export const getLatestFlagSearch = getLatestSearchsByType('flag')
export const getLatestDonorFlagSearch = getLatestSearchsByType('flagDonor')
export const getLatestRfmoSearch = getLatestSearchsByType('rfmo')
export const getLatestPortSearch = getLatestSearchsByType('port')
export const getLatestVesselSearch = getLatestSearchsByType('vessel')

export const getFlagStatesConfig = createSelector([getConfigData], (config) =>
  config !== null ? config.flagStates : null
)

export const getPortsConfig = createSelector([getConfigData, getEventType], (config, eventType) => {
  if (config === null) return null
  return config.ports[eventType] || null
})

export const getFlagStateGroups = createSelector([getConfigData], (config) =>
  config !== null ? config.flagStateGroups : null
)

export const getRfmosConfig = createSelector([getConfigData], (config) =>
  config !== null ? config.rfmos : null
)

export const getEezsConfig = createSelector([getConfigData], (config) =>
  config !== null ? config.eezs : null
)

export const getRfmosConfigIds = createSelector([getRfmosConfig], (rfmos) =>
  rfmos?.map((r) => r.id)
)

export const getStaticConfig = createSelector(
  [getVesselWithLabelFn, getPortsConfig, getEezsConfig, getFlagStatesConfig, getRfmosConfig],
  (vessel, port, eez, flag, rfmo) => {
    if (!port || !flag || !rfmo) return null
    return {
      vessel: vessel ? [vessel] : null,
      port,
      flag,
      flagDonor: flag,
      rfmo,
      eez,
    }
  }
)
