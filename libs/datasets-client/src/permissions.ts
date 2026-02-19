import type { UserPermission } from '@globalfishingwatch/api-types'
import { checkExistPermissionInList } from '@globalfishingwatch/auth-middleware/utils'

export const checkDatasetReportPermission = (datasetId: string, permissions: UserPermission[]) => {
  const permission = { type: 'dataset', value: datasetId, action: 'report' }
  return checkExistPermissionInList(permissions, permission)
}

export const checkDatasetDownloadTrackPermission = (
  datasetId: string,
  permissions: UserPermission[]
) => {
  // TODO make this number dynamic using wildcards like -*
  const downloadPermissions = [
    { type: 'dataset', value: datasetId, action: 'download-track' },
    { type: 'dataset', value: datasetId, action: 'download-track-10' },
    { type: 'dataset', value: datasetId, action: 'download-track-100' },
    { type: 'dataset', value: datasetId, action: 'download-track-*' },
  ]
  return downloadPermissions.some((permission) =>
    checkExistPermissionInList(permissions, permission)
  )
}
