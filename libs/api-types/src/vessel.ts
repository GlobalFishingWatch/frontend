export interface Authorization {
  source: string
  startDate: string
  endDate: string
  originalStartDate: number
  originalEndDate: number
}

export interface Vessel {
  authorizations?: Authorization[]
  builtYear?: string
  callsign?: string
  casco?: string
  dataset?: string
  depth?: string
  firstTransmissionDate: string
  flag: string
  fleet?: string
  geartype?: string
  grossTonnage?: string
  id: string
  imageList?: string[]
  imo?: string
  lastTransmissionDate: string
  length?: string
  matricula?: string
  mmsi?: string
  nationalId?: string
  operator?: string
  origin?: string
  owner?: string
  posCount?: number
  registeredGearType?: string
  shipname: string
  type?: string
  years?: number[]
}

export interface VesselSearch extends Vessel {
  dataset: string
  source: string // Label of the dataset
  vesselMatchId: string
}

export interface RelatedVesselSearchMerged extends VesselSearch {
  relatedVessels: VesselSearch[]
}
