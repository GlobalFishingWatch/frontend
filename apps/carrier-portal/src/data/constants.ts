import ReactGA from 'react-ga'
import {
  SearchTypes,
  QueryParam,
  GraphOption,
  ContextLayer,
  EventType,
  LayerTypes,
  ContextualLayerTypes,
} from 'types/app.types'

export const BASE_URL = process.env.NODE_ENV === 'production' ? '/carrier-portal' : ''
export const TRACK_INSPECTOR_URL = process.env.REACT_APP_TRACK_INSPECTOR_URL
export const DATA_DOWNLOAD_URL = process.env.REACT_APP_DATA_DOWNLOAD_URL
export const LATEST_SEARCH_STORAGE_KEY = 'CARRIER_PORTAL_LATEST_SEARCHS'
export const WELCOME_MODAL_READED_STORAGE_KEY = 'CARRIER_PORTAL_WELCOME_MODAL_08_2021_READED'
export const NOT_FOUND_ERROR = 'NOT_FOUND'
export const MIN_ZOOM_LEVEL_IN_DETAIL = 10
export const NUMBER_OF_GRAPH_GROUPS = 10
export const OTHERS_GROUP_KEY = '···'
export const MAX_ACTORS_TO_DISPLAY = 20
export const MAX_ZOOM_LEVEL = 14
export const EVENT_DURATION_RANGE = [1, 48]
export const DOWNLOAD_NAME_PREFIX = 'gfw-carrier-vessel-portal'
export const DATE_FORMAT = 'yyyy/MM/dd'
export const DOWNLOAD_DATE_FORMAT = `${DATE_FORMAT}-HH:mm`
export const TEXT_DATE_FORMAT = 'MMM do yyyy'
export const TEXT_DATETIME_FORMAT12 = 'MMM do yyyy hh:mm a'
export const EVENT_TYPES: { [key in EventType]: EventType } = {
  encounter: 'encounter',
  loitering: 'loitering',
}
export type EventTypeConfig = { id: EventType; label: string; active?: boolean }
export const EVENT_TYPES_CONFIG: EventTypeConfig[] = [
  { id: EVENT_TYPES.encounter, label: 'encounters' },
  { id: EVENT_TYPES.loitering, label: 'loitering' },
]

export const REPLACE_URL_PARAMS = [
  'eventType',
  'tab',
  'latitude',
  'longitude',
  'zoom',
  'graph',
  'timestamp',
]

type SearchTypesValues = { [key in SearchTypes]: string }
export const SEARCH_TYPES: SearchTypesValues = {
  flag: 'flag',
  flagDonor: 'flagDonor',
  rfmo: 'rfmo',
  eez: 'eez',
  vessel: 'vessel',
  start: 'start',
  end: 'end',
  port: 'port',
  duration: 'duration',
}

export const SEARCH_ASYNC_FIELDS = [SEARCH_TYPES.vessel]

export const SEARCH_SINGLE_SELECTION_FIELD = [
  SEARCH_TYPES.vessel,
  SEARCH_TYPES.start,
  SEARCH_TYPES.end,
  SEARCH_TYPES.duration,
]

export const SEARCH_TYPES_MUTUALLY_EXCLUSIVE = {
  [SEARCH_TYPES.eez]: [SEARCH_TYPES.rfmo],
  [SEARCH_TYPES.rfmo]: [SEARCH_TYPES.eez],
}

export const BASEMAP_COLOR = '#00265c'
export const EVENTS_COLORS = {
  encounter: '#FAE9A0',
  partially: '#F59E84',
  unmatched: '#CE2C54',
  loitering: '#cfa9f9',
  port: '#99EEFF',
}

export const LOITERING_TYPES = [
  { id: 'loitering', label: 'Loitering', color: EVENTS_COLORS.loitering },
]

export const ENCOUNTER_TYPES = {
  authorized: { id: 'authorized', label: 'Authorized', color: EVENTS_COLORS.encounter },
  partially: { id: 'partially', label: 'Partially authorized', color: EVENTS_COLORS.partially },
  unmatched: { id: 'unmatched', label: 'Unknown authorization', color: EVENTS_COLORS.unmatched },
}

export const TOOLTIPS = {
  flagStates:
    'Including fishing entities responsible for the flagging of fishing or carrier vessels',
  encounter:
    'Identified from AIS data as locations where two vessels, a carrier and fishing vessel, were within 500 meters for at least 2 hours and traveling at a median speed <2 knots, while at least 10 km from a coastal anchorage',
  [ENCOUNTER_TYPES.authorized.id]:
    'The carrier participating in the encounter has matching registry records from all the highlighted RFMOs where the event is taking place and during the time it took place. Registry records are obtained by GFW from the different RFMO public registry sites, both historic and current records',
  [ENCOUNTER_TYPES.partially.id]:
    'The carrier participating in the encounter has matching registry records from at least one highlighted RFMO where the event is taking place and during the time it took place. Registry records are obtained by GFW from the different RFMO public registry sites, both historic and current records',
  [ENCOUNTER_TYPES.unmatched.id]:
    'No matching registry records within the highlighted RFMOs were identified for the carrier participating in the encounter where the event is taking place and during the time it took place. Registry records are obtained by GFW from the different RFMO public registry sites, both historic and current records.',
  loitering:
    'Loitering is when a single vessel exhibits behavior indicative of a potential encounter event. Loitering occurs when a carrier vessel travels at average speeds of < 2 knots, while at least an average of 20 nautical miles from shore',
  copyright:
    'Global Fishing Watch and The Pew Charitable Trusts are working together to improve understanding and management of transshipment at-sea through greater transparency, monitoring and analysis of the activity. The organizations have generated and will maintain a global, public database and monitoring portal of carrier vessels involved in transshipment, and arm relevant authorities with the information and evidence needed to strengthen transparency and accelerate transshipment policy reform -- particularly within the five global tuna regional fisheries management organizations (RFMOs). The shared ambition is to ensure that transshipment does not facilitate illegal fishing -- and to instill confidence that transshipped catch is both legal and verifiable.',
}

export const GRAPH_OPTIONS_ENCOUNTER: GraphOption[] = [
  {
    label: 'Encounters in high seas by RFMO',
    value: 'rfmo',
    noDataMsg: 'All the encounters matching your filters occurred inside EEZ areas',
  },
  {
    label: 'Encounters by EEZ',
    value: 'eez',
    noDataMsg: 'All the encounters matching your filters occurred outside EEZ areas',
  },
  {
    label: 'Encounters by flag State of carrier',
    tooltip: TOOLTIPS.flagStates,
    value: 'flag-carrier',
  },
  {
    label: 'Encounters by flag State of donor vessel',
    tooltip: TOOLTIPS.flagStates,
    value: 'flag-vessel',
  },
  {
    label: 'Encounters by time',
    value: 'time',
  },
  {
    label: 'Encounters by next port',
    value: 'port',
    noDataMsg: 'There is no next port info for any encounter matching your filters',
  },
]

export const GRAPH_OPTIONS_LOITERING: GraphOption[] = [
  {
    label: 'Loitering events by RFMO',
    value: 'loitering-rfmo',
  },
  {
    label: 'Loitering events by EEZ',
    value: 'loitering-eez',
    noDataMsg: 'All the loitering events matching your filters occurred outside EEZ areas',
  },
  {
    label: 'Loitering events by flag State',
    value: 'loitering-flag',
    tooltip: TOOLTIPS.flagStates,
  },
  {
    label: 'Loitering events by time',
    value: 'loitering-time',
  },
  {
    label: 'Loitering events by next port',
    value: 'loitering-port',
    noDataMsg: 'There is no next port info for any loitering event matching your filters',
  },
]

export const ALL_GRAPH_OPTIONS = [...GRAPH_OPTIONS_ENCOUNTER, ...GRAPH_OPTIONS_LOITERING]

export const ENCOUNTER_RISKS = {
  authorized: 1,
  partially: 2,
  unmatched: 3,
}

export const CONTEXT_LAYERS_IDS: { [key in string]: LayerTypes } = {
  eez: 'eez',
  rfmo: 'cp_rfmo',
  otherRfmos: 'other_rfmos',
  nextPort: 'cp_next_port',
  mpant: 'mpant',
  bluefinRfmo: 'bluefin_rfmo',
  heatmap: 'heatmap',
}

export const EVENTS_LAYERS: ContextLayer[] = [
  {
    id: EVENT_TYPES.encounter,
    label: 'Encounters',
    color: EVENTS_COLORS.partially,
    description: '',
  },
  {
    id: EVENT_TYPES.loitering,
    label: 'Loitering events',
    color: EVENTS_COLORS.loitering,
    description: '',
  },
]

export const CONTEXT_LAYERS_COLORS: Record<ContextualLayerTypes, string> = {
  cp_rfmo: '#6b67e5',
  cp_next_port: EVENTS_COLORS.port,
  other_rfmos: '#d8d454',
  eez: '#93c96c',
  mpant: '#e5777c',
  bluefin_rfmo: '#A758FF',
}

export const CONTEXT_LAYERS: ContextLayer[] = [
  {
    id: CONTEXT_LAYERS_IDS.nextPort,
    label: 'Ports visited after {{eventType}}',
    color: CONTEXT_LAYERS_COLORS.cp_next_port,
    description: 'See the ports visited after the {{eventType}} that match your filters',
  },
  {
    id: CONTEXT_LAYERS_IDS.heatmap,
    label: 'Activity of currently filtered carriers',
    color: '#00ffc3',
    description:
      "Global Fishing Watch uses data about a vessel’s identity, type, location, speed, direction and more that is broadcast using the Automatic Identification System (AIS) and collected via satellites and terrestrial receivers. AIS was developed for safety/collision-avoidance. Global Fishing Watch analyzes AIS data collected from vessels that our research has identified as carriers. The activity layer displays a heatmap of carrier presence. The presence is determined by taking one position per day per carrier from the positions transmitted by the carrier's AIS. The displayed heatmap corresponds to the carriers included in the current application filters.",
  },
  {
    id: CONTEXT_LAYERS_IDS.rfmo,
    label: 'Registry RFMO areas',
    color: CONTEXT_LAYERS_COLORS.cp_rfmo,
    description:
      'RFMO stands for Regional Fishery Management Organization. These organizations are international organizations formed by countries with a shared interest in managing or conserving an area’s fish stock (All Tuna RFMOS, Geographic Area of Competence of South Pacific RFMO and The North Pacific Fisheries Commission).',
  },
  {
    id: CONTEXT_LAYERS_IDS.otherRfmos,
    label: 'Other RFMO areas',
    color: CONTEXT_LAYERS_COLORS.other_rfmos,
    description:
      'Convention on Conservation of Antarctic Marine Living Resources, North-East Atlantic Fisheries Commission, Northwest Atlantic Fisheries Organization, South-East Atlantic Fisheries Organization, South Indian Ocean Fisheries Agreement, and General Fisheries Commission for the Mediterranean. Source: fao.org/geonetwork',
  },
  {
    id: CONTEXT_LAYERS_IDS.eez,
    label: 'Exclusive Economic Zones',
    color: CONTEXT_LAYERS_COLORS.eez,
    description:
      'Exclusive Economic Zones (EEZ) are states’ sovereign waters, which extend 200 nautical miles from the coast. Source: marineregions.org',
  },
  {
    id: CONTEXT_LAYERS_IDS.mpant,
    label: 'Marine Protected Areas',
    color: CONTEXT_LAYERS_COLORS.mpant,
    description: 'Source: Protected Planet WDPA',
  },
  {
    id: CONTEXT_LAYERS_IDS.bluefinRfmo,
    label: 'Southern bluefin tuna range',
    color: CONTEXT_LAYERS_COLORS.bluefin_rfmo,
    description:
      'Prepared by GFW based on "The Current Status of International Fishery Stocks", 2018, Fisheries Agency and Japan Fisheries Research and Education Agency',
  },
]

export interface SelectGroup {
  id: string
  order: number
  label: string
}

export const SELECT_GROUPS: { [key: string]: SelectGroup } = {
  selected: {
    id: 'selected',
    order: 0,
    label: 'Selected options',
  },
  recent: {
    id: 'recent-search',
    order: 1,
    label: 'Recently selected options',
  },
  group: {
    id: 'group',
    order: 2,
    label: 'Groups',
  },
}

export type InfoLink = {
  id: string
  label: string
  link: string
}

export const INFO_LINKS: InfoLink[] = [
  {
    id: 'about',
    label: 'About the portal',
    link: 'https://globalfishingwatch.org/carrier-vessel-portal',
  },
  {
    id: 'authorization-records',
    label: 'Authorization Records',
    link: 'https://globalfishingwatch.org/authorization-records/',
  },
  {
    id: 'data-and-terminology',
    label: 'Data and Terminology disclaimers',
    link: 'https://globalfishingwatch.org/carrier-vessel-portal-disclaimers/',
  },
  {
    id: 'policies',
    label: 'Transshipment Policies by RFMOs',
    link: 'https://globalfishingwatch.org/transshipment-policies/',
  },
  {
    id: 'analysis',
    label: 'Transshipment Analysis',
    link: 'https://globalfishingwatch.org/rfmo-transshipment',
  },
  {
    id: 'faq',
    label: 'FAQs',
    link: 'https://globalfishingwatch.org/article-categories/carrier-vessel-portal/',
  },
]

type DefaulQueryTypes = { [key in QueryParam]: any }
export const DEFAULT_FILTERS: DefaulQueryTypes = {
  eventType: EVENT_TYPES.encounter,
  tab: 'carriers',
  graph: null,
  duration: null,
  start: '2017-01-01T00:00:00.000Z',
  end: '2018-12-31T23:59:59.000Z',
  vessel: null,
  flag: null,
  flagDonor: null,
  rfmo: null,
  eez: null,
  port: null,
  timestamp: null,
  layer: [EVENT_TYPES.encounter, CONTEXT_LAYERS_IDS.rfmo, CONTEXT_LAYERS_IDS.nextPort],
  zoom: 1,
  latitude: 20,
  longitude: 10,
  dataset: null,
  'access-token': undefined,
}

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const GOOGLE_UNIVERSAL_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_UNIVERSAL_ANALYTICS_ID
export const GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS: ReactGA.InitializeOptions = IS_PRODUCTION
  ? {}
  : { debug: true }
