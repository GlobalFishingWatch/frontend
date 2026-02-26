import { DATASET_PRIVATE_PREFIX, DATASET_PUBLIC_PREFIX } from '../datasets.const'

import type { CountryDatasetId } from './datasets.conventions'

export const LATEST_DATASETS_VMS: Record<
  CountryDatasetId,
  { identity: string; fishing: string; presence: string }
> = {
  bra: {
    identity: 'public-vms-bra-vessel-identity:v4.0' as const,
    fishing: 'public-vms-bra-fishing-effort:v4.0' as const,
    presence: 'public-vms-bra-presence:v4.0' as const,
  },
  chl: {
    identity: 'public-vms-chl-vessel-identity:v4.0' as const,
    fishing: 'public-vms-chl-fishing-effort:v4.0' as const,
    presence: 'public-vms-chl-presence:v4.0' as const,
  },
  plw: {
    identity: 'public-vms-plw-vessel-identity:v4.0' as const,
    fishing: 'public-vms-plw-fishing-effort:v4.0' as const,
    presence: 'public-vms-plw-presence:v4.0' as const,
  },
  mne: {
    identity: 'public-vms-mne-vessel-identity:v4.0' as const,
    fishing: 'public-vms-mne-fishing-effort:v4.0' as const,
    presence: 'public-vms-mne-presence:v4.0' as const,
  },
  per: {
    identity: 'public-vms-per-vessel-identity:v4.0' as const,
    fishing: 'public-vms-per-fishing-effort:v4.0' as const,
    presence: 'public-vms-per-presence:v4.0' as const,
  },
  pan: {
    identity: 'public-vms-pan-vessel-identity:v4.0' as const,
    fishing: 'public-vms-pan-fishing-effort:v4.0' as const,
    presence: 'public-vms-pan-presence:v4.0' as const,
  },
  nor: {
    identity: 'public-vms-nor-vessel-identity:v4.0' as const,
    fishing: 'public-vms-nor-fishing-effort:v4.0' as const,
    presence: 'public-vms-nor-presence:v4.0' as const,
  },
  ecu: {
    identity: 'public-vms-ecu-vessel-identity:v4.0' as const,
    fishing: 'public-vms-ecu-fishing-effort:v4.0' as const,
    presence: 'public-vms-ecu-presence:v4.0' as const,
  },
  cri: {
    identity: 'public-vms-cri-vessel-identity:v4.0' as const,
    fishing: 'public-vms-cri-fishing-effort:v4.0' as const,
    presence: 'public-vms-cri-presence:v4.0' as const,
  },
  blz: {
    identity: 'public-vms-blz-vessel-identity:v4.0' as const,
    fishing: 'public-vms-blz-fishing-effort:v4.0' as const,
    presence: 'public-vms-blz-presence:v4.0' as const,
  },
  png: {
    identity: 'public-vms-png-vessel-identity:v4.0' as const,
    fishing: 'public-vms-png-fishing-effort:v4.0' as const,
    presence: 'public-vms-png-presence:v4.0' as const,
  },
} as const

export const replaceDatasetPublicToPrivate = (dataset: string): string => {
  return dataset.startsWith(DATASET_PUBLIC_PREFIX)
    ? dataset.replace(DATASET_PUBLIC_PREFIX, DATASET_PRIVATE_PREFIX)
    : dataset
}
