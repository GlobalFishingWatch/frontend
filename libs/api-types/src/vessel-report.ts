export type ReportVessel = {
  id: string
  callsign: string
  dataset: string
  date: string
  firstTransmissionDate: string
  flag: string
  geartype: string
  hours: number
  imo: string
  lastTransmissionDate: string
  lat: string
  lon: string
  mmsi: string
  shipName: string
  vesselId: string
  vesselType: string
}

export type ReportVesselsByDataset = {
  [dataset: string]: ReportVessel[]
}
