import { ChoiceOption } from '@globalfishingwatch/ui-components/dist/choice'
import { t } from 'features/i18n/i18n'

export enum Format {
  Csv = 'csv',
  GeoTIFF = 'tif',
  NetCDF = 'netcdf',
}

export enum GroupBy {
  Vessel = 'vessel_id',
  GearType = 'gearType',
  Flag = 'flag',
  FlagAndGearType = 'flagAndGearType',
}

export enum TemporalResolution {
  Daily = 'daily',
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export enum SpatialResolution {
  Low = 'low',
  High = 'high',
}

export const formatOptions: ChoiceOption[] = [
  {
    id: Format.Csv,
    title: 'csv',
  },
  {
    id: Format.GeoTIFF,
    title: 'geotiff',
  },
  {
    id: Format.NetCDF,
    title: 'netcdf',
    disabled: true,
    tooltip: t('common.comingSoon', 'Coming Soon!'),
    tooltipPlacement: 'top',
  },
]

export const spatialResolutionOptions: ChoiceOption[] = [
  {
    id: SpatialResolution.Low,
    title: '0.1º',
  },
  {
    id: SpatialResolution.High,
    title: '0.01º',
  },
]

export const MAX_AREA_FOR_HIGH_SPATIAL_RESOLUTION = 25000000000000
