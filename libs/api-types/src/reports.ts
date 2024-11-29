import type { OwnerType, Workspace } from './workspaces'

export type Report = {
  id: string
  name: string
  description: string
  public?: boolean
  areaId: string
  datasetId: string
  workspace: Omit<Workspace, 'viewAccess' | 'editAccess'>
  createdAt: string
  ownerId: number
  ownerType: OwnerType
}
