export interface VesselGroupVessel {
  dataset: string
  vesselId: string
}

export interface VesselGroup {
  id?: string
  name: string
  vessels: VesselGroupVessel[]
}
