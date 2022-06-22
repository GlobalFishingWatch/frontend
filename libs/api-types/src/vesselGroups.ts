export interface VesselGroupVessel {
  dataset: string
  vesselId: string
}

export interface VesselGroup {
  id?: number
  name: string
  vessels: VesselGroupVessel[]
}
