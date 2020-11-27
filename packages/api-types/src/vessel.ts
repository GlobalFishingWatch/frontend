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
