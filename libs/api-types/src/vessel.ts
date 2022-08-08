export interface Authorization {
  source: string
  startDate: string
  endDate: string
  originalStartDate: number
  originalEndDate: number
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
  casco?: string
  matricula?: string
  nationalId?: string
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
  years?: number[]
}

export interface VesselSearch extends Vessel {
  dataset: string
  source: string // Label of the dataset
  vesselMatchId: string
  posCount?: number
}

export interface RelatedVesselSearchMerged extends VesselSearch {
  relatedVessels: VesselSearch[],
}