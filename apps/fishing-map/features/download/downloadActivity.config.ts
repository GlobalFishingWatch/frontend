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
    title: 'geotiff',
  },
  {
    id: Format.Csv,
    title: 'csv',
  },
  {
    id: Format.Json,
    title: 'json',
  },
  {
    id: Format.NetCDF,
    title: 'netcdf',
    disabled: true,
    tooltip: t('common.comingSoon', 'Coming Soon!'),
    tooltipPlacement: 'top',
  },
]

export const VESSEL_FORMAT_OPTIONS: ChoiceOption[] = [
  {
    id: Format.Csv,
    title: 'csv',
  },
  {
    id: Format.Json,
    title: 'json',
  },
]

export const VESSEL_GROUP_BY_OPTIONS: ChoiceOption[] = [
  {
    id: GroupBy.Vessel,
    title: t('common.vesselId', 'Vessel id'),
  },
  {
    id: GroupBy.MMSI,
    title: t('vessel.mmsi', 'MMSI'),
  },
  {
    id: GroupBy.Flag,
    title: t('vessel.flag', 'Flag'),
  },
  {
    id: GroupBy.GearType,
    title: t('vessel.geartype', 'Gear Type'),
  },
  {
    id: GroupBy.FlagAndGearType,
    title: `${t('vessel.flag', 'Flag')} + ${t('vessel.geartype', 'Gear Type')}`,
  },
]

export const GRIDDED_GROUP_BY_OPTIONS: ChoiceOption[] = [
  {
    id: GroupBy.None,
    title: t('common.none', 'None'),
  },
  ...VESSEL_GROUP_BY_OPTIONS,
]

export const SPATIAL_RESOLUTION_OPTIONS: ChoiceOption[] = [
  {
    id: SpatialResolution.Low,
    title: '0.1º',
  },
  {
    id: SpatialResolution.High,
    title: '0.01º',
  },
  {
    id: SpatialResolution.VeryHigh,
    title: '0.001º',
    disabled: true,
    tooltip: t('common.comingSoon', 'Coming Soon!'),
    tooltipPlacement: 'top',
  },
]

export const MAX_AREA_FOR_HIGH_SPATIAL_RESOLUTION = 25000000000000 //Bigger than the biggest EEZ (Russia)
