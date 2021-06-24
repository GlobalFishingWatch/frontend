export const BASE_URL = process.env.NODE_ENV === 'production' ? '/vessel-history' : ''

export const SPLASH_TIMEOUT = 1000
export const RESULTS_PER_PAGE = 25
export const SEARCH_MIN_CHARACTERS = 3
export const BASE_DATASET = 'full-global-fishing-vessels:v20201001'
export const EVENTS_DATASET = 'scratch_alvaro.published_events_fishing'
export const SHOW_VESSEL_API_SOURCE =
  process.env.REACT_APP_WORKSPACE_ENV === 'production' ? false : true

export const API_GATEWAY = process.env.REACT_APP_API_GATEWAY
export const LANDMASS_OFFLINE_GEOJSON = '/data/ne_10m_admin_0_countries_gj.geojson'

export const ENCOUNTERS_MIN_DURATION = 2
export const ENCOUNTERS_MAX_DURATION = 99
export const FISHING_EVENTS_MIN_DURATION = 0
export const FISHING_EVENTS_MAX_DURATION = 999
export const LOITERING_EVENTS_MIN_DURATION = 1
export const LOITERING_EVENTS_MAX_DURATION = 99

export const ENCOUNTERS_MIN_DISTANCE = 0
export const ENCOUNTERS_MAX_DISTANCE = 99
export const FISHING_EVENTS_MIN_DISTANCE = 0
export const FISHING_EVENTS_MAX_DISTANCE = 99
export const LOITERING_EVENTS_MIN_DISTANCE = 0
export const LOITERING_EVENTS_MAX_DISTANCE = 99
