export type EndpointParamType = 'enum' | 'boolean' | 'number' | 'string' | 'sql'

export type EndpointParam = {
  id: string
  type: EndpointParamType
  enum?: readonly string[] | string[]
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
  EventsStats = 'events-stats',
  FourwingsBreaks = '4wings-bins',
  FourwingsInteraction = '4wings-interaction',
  // FourwingsLegend = '4wings-legend',
  // FourwingsLegendByZoom = '4wings-legend-by-zoom',
  FourwingsStats = '4wings-stats',
  // FourwingsStatsCreate = '4wings-stats-create',
  FourwingsTiles = '4wings-tiles',
  Tracks = 'tracks',
  Thumbnails = 'thumbnails',
  PMTiles = 'pm-tiles',
  UserTracks = 'user-tracks-data',
  // UserTracksTiles = 'user-tracks-tiles',
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
  params: readonly EndpointParam[] | EndpointParam[]
  query: readonly EndpointParam[] | EndpointParam[]
}
