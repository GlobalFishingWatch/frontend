import type { UserPermission } from '@globalfishingwatch/api-types'
import { checkExistPermissionInList } from '@globalfishingwatch/auth-middleware/utils'

import type { CountryDatasetId } from './migrations/datasets.conventions'
import { COUNTRY_DATASET_IDS } from './migrations/datasets.conventions'
import { LATEST_DATASETS_VMS } from './migrations/datasets.latest'
import { replaceDatasetPublicToPrivate } from './datasets.utils'

const SEARCH_ACTIONS = ['basic-search', 'advanced-search']

export const getPrivateVmsIdentityDatasetId = (code: CountryDatasetId) =>
  replaceDatasetPublicToPrivate(LATEST_DATASETS_VMS[code].identity)

export const getPrivateSearchDatasetIds = (permissions: UserPermission[] = []) =>
  COUNTRY_DATASET_IDS.flatMap((code) => {
    const datasetId = getPrivateVmsIdentityDatasetId(code)
    return SEARCH_ACTIONS.some((action) =>
      checkExistPermissionInList(permissions, { type: 'dataset', value: datasetId, action })
    )
      ? [datasetId]
      : []
  })

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
