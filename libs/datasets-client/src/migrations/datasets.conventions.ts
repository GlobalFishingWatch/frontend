const AIS_DATASET_ID = 'ais' as const

const VMS_DATASET_ID = 'vms' as const

export const DATASET_SOURCE_ID = [AIS_DATASET_ID, VMS_DATASET_ID]

export type DatasetSourceId = (typeof DATASET_SOURCE_ID)[number]

const BELIZE_DATASET_ID = 'blz' as const
const BRAZIL_DATASET_ID = 'bra' as const
const CHILE_DATASET_ID = 'chl' as const
const COSTA_RICA_DATASET_ID = 'cri' as const
const ECUADOR_DATASET_ID = 'ecu' as const
const NORWAY_DATASET_ID = 'nor' as const
const MONTENEGRO_DATASET_ID = 'mne' as const
const PALAU_DATASET_ID = 'plw' as const
const PANAMA_DATASET_ID = 'pan' as const
const PERU_DATASET_ID = 'per' as const
const PNG_DATASET_ID = 'png' as const

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
