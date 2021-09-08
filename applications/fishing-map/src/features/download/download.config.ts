import { ChoiceOption } from '@globalfishingwatch/ui-components/dist/choice'
import { t } from 'features/i18n/i18n'

export enum Format {
  Csv = 'csv',
  GeoTIFF = 'tiff',
  NetCDF = 'netcdf',
}

export enum GroupBy {
  Vessel = 'vessel',
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

export const groupByOptions: ChoiceOption[] = [
  {
    id: GroupBy.Vessel,
    title: t('common.vessel', 'Vessel'),
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

export const temporalResolutionOptions: ChoiceOption[] = [
  {
    id: TemporalResolution.Daily,
    title: t('download.daily', 'Daily'),
  },
  {
    id: TemporalResolution.Monthly,
    title: t('download.monthly', 'Monthly'),
  },
  {
    id: TemporalResolution.Yearly,
    title: t('download.yearly', 'Yearly'),
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
