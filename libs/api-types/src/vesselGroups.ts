export type VesselGroupVessel = {
  dataset: string
  vesselId: string
  relationId: string
  flag?: string
  vesselType?: string
}

export type VesselGroupVesselsSummary = {
  totalVessels: number
  distinctRelationIds: number
  datasets: string[]
}

export type VesselGroup = {
  id: string
  name: string
  vessels?: VesselGroupVessel[]
  vesselsSummary?: VesselGroupVesselsSummary
  public?: boolean
  ownerId?: number
  ownerType?: string
  createdAt?: string
  updatedAt?: string
}

export type VesselGroupUpsert = Partial<Pick<VesselGroup, 'id' | 'name' | 'vessels' | 'public'>>
