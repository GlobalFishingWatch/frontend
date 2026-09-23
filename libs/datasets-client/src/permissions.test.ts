import { describe, expect, it } from 'vitest'

import { getPrivateSearchDatasetIds } from './permissions'

// The API issues private VMS grants as `private-vms-<code>-*` (gfw-terraform-api resources.tf),
// never as a dataset id, so the ids have to come from LATEST_DATASETS_VMS and be checked.
describe('getPrivateSearchDatasetIds', () => {
  it('returns the identity dataset of every country granted a search action', () => {
    expect(
      getPrivateSearchDatasetIds([
        { type: 'dataset', value: 'private-vms-pan-*', action: 'basic-search' },
        { type: 'dataset', value: 'private-vms-cri-*', action: 'advanced-search' },
        { type: 'dataset', value: '*public*', action: 'basic-search' },
      ] as any)
    ).toEqual(['private-vms-cri-vessel-identity:v4.0', 'private-vms-pan-vessel-identity:v4.1'])
  })

  it('ignores grants without a search action', () => {
    expect(
      getPrivateSearchDatasetIds([
        { type: 'dataset', value: 'private-vms-nor-*', action: 'read' },
      ] as any)
    ).toEqual([])
  })

  it('ignores the legacy country-name grants, they do not match the v4 dataset ids', () => {
    expect(
      getPrivateSearchDatasetIds([
        { type: 'dataset', value: 'private-panama-*', action: 'basic-search' },
        { type: 'dataset', value: '*costa-rica*', action: 'basic-search' },
      ] as any)
    ).toEqual([])
  })

  it('returns nothing without permissions', () => {
    expect(getPrivateSearchDatasetIds()).toEqual([])
  })
})
