import { OwnerType, Workspace } from './workspaces'

export type Report = {
  id: string
  name: string
  description: string
  public?: boolean
  areaId: string
  datasetId: string
  workspace: Workspace
  createdAt: string
  ownerId: number
  ownerType: OwnerType
}
