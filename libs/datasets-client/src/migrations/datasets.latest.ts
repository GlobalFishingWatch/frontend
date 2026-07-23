import type { CountryDatasetId } from './datasets.conventions'

export const LATEST_DATASETS_VMS: Record<
  CountryDatasetId,
  { identity: string; fishing: string; presence: string }
> = {
  bra: {
    identity: 'public-vms-bra-vessel-identity:v4.0' as const,
    fishing: 'public-vms-bra-fishing-effort:v4.0' as const,
    presence: 'public-brazil-opentuna-presence:v20210311' as const, // Not updated in pipe4
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
  // Not available in pipe4
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
    identity: 'public-vms-pan-vessel-identity:v4.1' as const,
    fishing: 'public-vms-pan-fishing-effort:v4.1' as const,
    presence: 'public-vms-pan-presence:v4.1' as const,
  },
  nor: {
    identity: 'public-vms-nor-vessel-identity:v4.0' as const,
    fishing: 'public-vms-nor-fishing-effort:v4.0' as const,
    presence: 'public-vms-nor-presence:v4.0' as const,
  },
  ecu: {
    identity: 'public-vms-ecu-vessel-identity:v4.0' as const,
    fishing: 'public-vms-ecu-fishing-effort:v4.0' as const,
    presence: 'public-ecuador-presence:v20211126' as const, // Not updated in pipe4
  },
  cri: {
    identity: 'public-vms-cri-vessel-identity:v4.0' as const,
    fishing: 'public-vms-cri-fishing-effort:v4.0' as const,
    presence: 'public-vms-cri-presence:v4.0' as const,
  },
  blz: {
    identity: 'public-vms-blz-vessel-identity:v4.0' as const,
    fishing: 'public-belize-fishing-effort:v20220304' as const, // No fishing effort in pipe 4
    presence: 'public-vms-blz-presence:v20220304' as const, // Not updated in pipe4
  },
  png: {
    identity: 'public-vms-png-vessel-identity:v4.0' as const,
    fishing: 'public-vms-png-fishing-effort:v4.0' as const,
    presence: 'public-vms-png-presence:v4.0' as const,
  },
} as const
