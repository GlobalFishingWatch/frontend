export type EndpointParamType = 'enum' | 'boolean' | 'number' | 'string' | 'sql'

export type EndpointParam = {
  id: string
  label: string
  type: EndpointParamType
  enum?: string[]
  array?: boolean
  required?: boolean
  description?: string
  default?: string | boolean | number
}

export enum EndpointId {
  ContextTiles = 'context-tiles',
  ContextFeature = 'context-feature',
  ClusterTiles = 'events-cluster-tiles',
  ClusterTilesInteraction = 'events-cluster-interaction',
  ContextGeojson = 'temporal-context-geojson',
  Events = 'events',
  EventsDetail = 'events-detail',
  FourwingsBreaks = '4wings-bins',
  FourwingsInteraction = '4wings-interaction',
  FourwingsLegend = '4wings-legend',
  FourwingsTiles = '4wings-tiles',
  Tracks = 'tracks',
  Thumbnails = 'thumbnails',
  PMTiles = 'pm-tiles',
  UserTracks = 'user-tracks-data',
  Vessel = 'vessel',
  VesselAdvancedSearch = 'advanced-search-vessels',
  VesselList = 'list-vessels',
  VesselSearch = 'search-vessels',
}

export type Endpoint = {
  id: EndpointId
  description?: string
  method?: 'GET' | 'POST'
  pathTemplate: string
  downloadable: boolean
  body?: any
  params: EndpointParam[]
  query: EndpointParam[]
}
