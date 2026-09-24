const AIS_DATASET_ID = 'ais' as const

const VMS_DATASET_ID = 'vms' as const

export const DATASET_SOURCE_ID = [AIS_DATASET_ID, VMS_DATASET_ID]

export type DatasetSourceId = (typeof DATASET_SOURCE_ID)[number]

export const BELIZE_DATASET_ID = 'blz' as const
export const BRAZIL_DATASET_ID = 'bra' as const
export const CHILE_DATASET_ID = 'chl' as const
export const COSTA_RICA_DATASET_ID = 'cri' as const
export const ECUADOR_DATASET_ID = 'ecu' as const
export const NORWAY_DATASET_ID = 'nor' as const
export const MONTENEGRO_DATASET_ID = 'mne' as const
export const PALAU_DATASET_ID = 'plw' as const
export const PANAMA_DATASET_ID = 'pan' as const
export const PERU_DATASET_ID = 'per' as const
export const PNG_DATASET_ID = 'png' as const

export const COUNTRY_DATASET_IDS = [
  BELIZE_DATASET_ID,
  BRAZIL_DATASET_ID,
  CHILE_DATASET_ID,
  COSTA_RICA_DATASET_ID,
  ECUADOR_DATASET_ID,
  MONTENEGRO_DATASET_ID,
  NORWAY_DATASET_ID,
  PALAU_DATASET_ID,
  PANAMA_DATASET_ID,
  PERU_DATASET_ID,
  PNG_DATASET_ID,
]

export type CountryDatasetId = (typeof COUNTRY_DATASET_IDS)[number]
