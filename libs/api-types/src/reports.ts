import { OwnerType, Workspace } from '@globalfishingwatch/api-types'

export type Report = {
  id: string
  name: string
  description: string
  public?: boolean
  areaId: string
  datasetId: string
  workspace: Workspace
  createdAt: string
  ownerId: string
  ownerType: OwnerType
}
