export interface VesselGroupVessel {
  dataset: string
  vesselId: string
  // TODO why the need for these 2 fields?
  flag?: string
  vesselType?: string
}

export interface VesselGroup {
  id?: string
  name: string
  vessels: VesselGroupVessel[]
}
