export type FiltersParams = {
  flags: string[] | null
  vessel_types: string[] | null
  gear_types: string[] | null
}

export type AreaParams = {
  name: string | null
  buffer: boolean | null
}

export type VesselParams = {
  name: string | null
  imo: string | null
  mmsi: string | null
}

export type PortParams = {
  name: string | null
  country: string | null
}

export type DatasetType =
  | 'activity'
  | 'fishing'
  | 'presence'
  | 'detections'
  | 'VIIRS'
  | 'SAR'
  | 'events'
  | 'port_visits'
  | 'encounters'
  | 'loitering'
  | 'environment'
  | 'sea_surface_temperature'
  | 'salinity'
  | 'chlorophyll'

export type ConfigurationParams = {
  start_date: string | null
  end_date: string | null
  dataset: DatasetType | null
  filters: FiltersParams | null
  area: AreaParams | null
  port: PortParams | null
  vessel: VesselParams | null
}
