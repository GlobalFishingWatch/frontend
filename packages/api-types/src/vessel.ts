export interface Authorization {
  source: string
  startDate: string
  endDate: string
}

export interface Vessel {
  id: string
  flag: string
  shipname: string
  firstTransmissionDate: string
  lastTransmissionDate: string
  dataset?: string
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
  authorizations?: Authorization[]
  registeredGearType?: string
  imageList?: string[]
}

export interface VesselSearch extends Vessel {
  dataset: string
  source: string // Label of the dataset
  vesselMatchId: string
}
