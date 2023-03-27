export enum ReportStatus {
  NotStarted = 'not-started',
  Generating = 'generating',
  Done = 'done',
  Failed = 'failed',
}

export type Report = {
  id: string
  name: string
  userId: number
  userType: string
  completedDate?: string
  startedDate?: string
  downloaded: boolean
  createdAt: string
  status: ReportStatus
}

export type ReportVessel = {
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
