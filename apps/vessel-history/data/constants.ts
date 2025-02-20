export const BASE_URL =
  process.env.NEXT_PUBLIC_URL || (process.env.NODE_ENV === 'production' ? '/vessel-viewer' : '')

export const SPLASH_TIMEOUT = 1000
export const RESULTS_PER_PAGE = 25
export const SEARCH_MIN_CHARACTERS = 3
// TODO: Remove this and load searchable datasets from dataview
export const BASE_DATASET =
  'public-global-fishing-vessels:v20201001,public-global-carrier-vessels:v20201001,public-global-support-vessels:v20201001'
export const SHOW_VESSEL_API_SOURCE = true

export const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY
export const LANDMASS_OFFLINE_GEOJSON = `${
  process.env.NEXT_PUBLIC_URL ?? ''
}/data/ne_10m_admin_0_countries_gj.geojson`

export const TMT_CONTACT_US_URL = process.env.NEXT_PUBLIC_TMT_CONTACT_US_URL
export const GFW_CONTACT_US_MAIL = 'support@globalfishingwatch.org'

export const ENCOUNTERS_MIN_DURATION = 2
export const ENCOUNTERS_MAX_DURATION = 99
export const FISHING_EVENTS_MIN_DURATION = 0
export const FISHING_EVENTS_MAX_DURATION = 999
export const GAP_EVENTS_MIN_DURATION = 1
export const GAP_EVENTS_MAX_DURATION = 87600
export const LOITERING_EVENTS_MIN_DURATION = 1
export const LOITERING_EVENTS_MAX_DURATION = 99
export const PORTVISIT_EVENTS_MIN_DURATION = 3
export const PORTVISIT_EVENTS_MAX_DURATION = 8765

export const ENCOUNTERS_MIN_DISTANCE = 0
export const ENCOUNTERS_MAX_DISTANCE = 99
export const FISHING_EVENTS_MIN_DISTANCE = 0
export const FISHING_EVENTS_MAX_DISTANCE = 99
export const GAP_EVENTS_MIN_DISTANCE = 0
export const GAP_EVENTS_MAX_DISTANCE = 12000
export const LOITERING_EVENTS_MIN_DISTANCE = 0
export const LOITERING_EVENTS_MAX_DISTANCE = 99
export const PORTVISIT_EVENTS_MIN_DISTANCE = 0
export const PORTVISIT_EVENTS_MAX_DISTANCE = 12000

export const PORT_CONFIDENCE = {
  '2': 'low',
  '3': 'medium',
  '4': 'high',
}
