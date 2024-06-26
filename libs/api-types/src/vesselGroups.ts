export interface VesselGroupVessel {
  dataset: string
  vesselId: string
  flag?: string
  vesselType?: string
}

export interface VesselGroup {
  id: string
  name: string
  vessels: VesselGroupVessel[]
  public?: boolean
  ownerId?: number
  ownerType?: string
  createdAt?: string
}

export type VesselGroupUpsert = Omit<VesselGroup, 'id' | 'public' | 'ownerId' | 'ownerType'>
