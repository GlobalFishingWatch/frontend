export interface Vessel {
  id: string
  flag: string
  shipname: string
  firstTransmissionDate: string
  lastTransmissionDate: string
  imo?: string
  mmsi?: string
  callsign?: string
  fleet?: string
}

export interface VesselSearch extends Vessel {
  dataset: string
  source: string // Label of the dataset
}
