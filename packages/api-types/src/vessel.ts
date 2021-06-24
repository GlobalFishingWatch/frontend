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
  origin?: string
  type?: string
  geartype?: string
  length?: string
  depth?: string
  grossTonnage?: string
  owner?: string
  operator?: string
  builtYear?: string
  authorizations?: string[]
  registeredGearType?: string
  imageList?: string[]
}

export interface VesselSearch extends Vessel {
  dataset: string
  source: string // Label of the dataset
  vesselMatchId: string
}
