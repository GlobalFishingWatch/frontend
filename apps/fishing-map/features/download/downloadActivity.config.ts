import type { ChoiceOption } from '@globalfishingwatch/ui-components'

import { t } from 'features/i18n/i18n'

export enum HeatmapDownloadTab {
  ByVessel = 'byVessel',
  Gridded = 'gridded',
  Environment = 'environment',
}

export enum HeatmapDownloadFormat {
  GeoTIFF = 'TIF',
  Json = 'JSON',
  Csv = 'CSV',
  Geopackage = 'GEOPACKAGE',
}

export enum GroupBy {
  None = 'NONE',
  Vessel = 'VESSEL_ID',
  MMSI = 'MMSI',
  GearType = 'GEARTYPE',
  Flag = 'FLAG',
  FlagAndGearType = 'FLAGANDGEARTYPE',
}

export enum TemporalResolution {
  Full = 'ENTIRE',
  Hourly = 'HOURLY',
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Yearly = 'YEARLY',
}

export enum SpatialResolution {
  Low = 'LOW',
  High = 'HIGH',
  VeryHigh = 'VERY-HIGH',
}

export const GRIDDED_FORMAT_OPTIONS: ChoiceOption<HeatmapDownloadFormat>[] = [
  {
    id: HeatmapDownloadFormat.GeoTIFF,
    label: 'geotiff',
  },
  {
    id: HeatmapDownloadFormat.Csv,
    label: 'csv',
  },
  {
    id: HeatmapDownloadFormat.Json,
    label: 'json',
  },
  {
    id: HeatmapDownloadFormat.Geopackage,
    label: 'Geopackage',
    disabled: true,
    tooltip: t('common.comingSoon', 'Coming Soon!'),
    tooltipPlacement: 'top',
  },
]

export const VESSEL_FORMAT_OPTIONS: ChoiceOption<HeatmapDownloadFormat>[] = [
  {
    id: HeatmapDownloadFormat.Csv,
    label: 'csv',
  },
  {
    id: HeatmapDownloadFormat.Json,
    label: 'json',
  },
]

export const ENVIRONMENT_FORMAT_OPTIONS: ChoiceOption<HeatmapDownloadFormat>[] = [
  {
    id: HeatmapDownloadFormat.GeoTIFF,
    label: 'geotiff',
  },
  {
    id: HeatmapDownloadFormat.Csv,
    label: 'csv',
  },
]

export const getBaseGroupByOptions = (): ChoiceOption<GroupBy>[] => {
  return [
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
}
export const getVesselGroupOptions = (): ChoiceOption<GroupBy>[] => [
  {
    id: GroupBy.Vessel,
    label: t('common.none', 'None'),
  },
  ...getBaseGroupByOptions(),
]

export const getGriddedGroupOptions = (): ChoiceOption<GroupBy>[] => [
  {
    id: GroupBy.None,
    label: t('common.none', 'None'),
  },
  ...getBaseGroupByOptions(),
]

export const SPATIAL_RESOLUTION_OPTIONS: ChoiceOption<SpatialResolution>[] = [
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

export const getTemporalResolutionOptions = (): ChoiceOption<TemporalResolution>[] => [
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
