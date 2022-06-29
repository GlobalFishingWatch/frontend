export interface VesselGroupVessel {
  dataset: string
  vesselId: string
  flag?: string
  vesselType?: string
}

export interface VesselGroup {
  id: number
  name: string
  vessels: VesselGroupVessel[]
  ownerId: number
  ownerType: string
}

export type VesselGroupUpsert = Omit<VesselGroup, 'id' | 'ownerId' | 'ownerType'>
