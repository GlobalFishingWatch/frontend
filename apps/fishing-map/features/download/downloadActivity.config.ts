import { ChoiceOption } from '@globalfishingwatch/ui-components'
import { t } from 'features/i18n/i18n'

export enum Downloads {
  ByVessel = 'byVessel',
  Gridded = 'gridded',
}

export enum Format {
  GeoTIFF = 'tif',
  Json = 'json',
  Csv = 'csv',
  NetCDF = 'netcdf',
}

export enum GroupBy {
  None = 'none',
  Vessel = 'vessel_id',
  MMSI = 'mmsi',
  GearType = 'gearType',
  Flag = 'flag',
  FlagAndGearType = 'flagAndGearType',
}

export enum TemporalResolution {
  Full = 'entire',
  Hourly = 'hourly',
  Daily = 'daily',
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export enum SpatialResolution {
  Low = 'low',
  High = 'high',
  VeryHigh = 'very-high',
}

export const GRIDDED_FORMAT_OPTIONS: ChoiceOption[] = [
  {
    id: Format.GeoTIFF,
    label: 'geotiff',
  },
  {
    id: Format.Csv,
    label: 'csv',
  },
  {
    id: Format.Json,
    label: 'json',
  },
  {
    id: Format.NetCDF,
    label: 'netcdf',
    disabled: true,
    tooltip: t('common.comingSoon', 'Coming Soon!'),
    tooltipPlacement: 'top',
  },
]

export const VESSEL_FORMAT_OPTIONS: ChoiceOption[] = [
  {
    id: Format.Csv,
    label: 'csv',
  },
  {
    id: Format.Json,
    label: 'json',
  },
]

const BASE_GROUP_BY_OPTIONS: ChoiceOption[] = [
  {
    id: GroupBy.MMSI,
    label: t('vessel.mmsi', 'MMSI'),
  },
  {
    id: GroupBy.Flag,
    label: t('vessel.flag', 'Flag'),
  },
  {
    id: GroupBy.GearType,
    label: t('vessel.geartype', 'Gear Type'),
  },
  {
    id: GroupBy.FlagAndGearType,
    label: `${t('vessel.flag', 'Flag')} + ${t('vessel.geartype', 'Gear Type')}`,
  },
]
export const VESSEL_GROUP_BY_OPTIONS: ChoiceOption[] = [
  {
    id: GroupBy.Vessel,
    label: t('common.none', 'None'),
  },
  ...BASE_GROUP_BY_OPTIONS,
]

export const GRIDDED_GROUP_BY_OPTIONS: ChoiceOption[] = [
  {
    id: GroupBy.None,
    label: t('common.none', 'None'),
  },
  ...BASE_GROUP_BY_OPTIONS,
]

export const SPATIAL_RESOLUTION_OPTIONS: ChoiceOption[] = [
  {
    id: SpatialResolution.Low,
    label: '0.1º',
  },
  {
    id: SpatialResolution.High,
    label: '0.01º',
  },
  {
    id: SpatialResolution.VeryHigh,
    label: '0.001º',
    disabled: true,
    tooltip: t('common.comingSoon', 'Coming Soon!'),
    tooltipPlacement: 'top',
  },
]

export const TEMPORAL_RESOLUTION_OPTIONS: ChoiceOption[] = [
  {
    id: TemporalResolution.Full,
    label: t('download.fullTimeRange', 'Selected time range'),
  },
  {
    id: TemporalResolution.Daily,
    label: t('download.daily', 'Day'),
  },
  {
    id: TemporalResolution.Monthly,
    label: t('download.monthly', 'Month'),
  },
  {
    id: TemporalResolution.Yearly,
    label: t('download.yearly', 'Year'),
  },
]

export const MAX_AREA_FOR_HIGH_SPATIAL_RESOLUTION = 25000000000000 //Bigger than the biggest EEZ (Russia)
