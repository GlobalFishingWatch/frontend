import { ChoiceOption } from '@globalfishingwatch/ui-components'

export enum Format {
  Csv = 'csv',
  GeoJson = 'geojson',
}

export type FormatExtension = Record<Format, string>
export const FORMAT_EXTENSION: FormatExtension = {
  [Format.Csv]: 'csv',
  [Format.GeoJson]: 'geo.json',
}

export const FORMAT_OPTIONS: ChoiceOption[] = [
  {
    id: Format.Csv,
    label: 'csv',
  },
  {
    id: Format.GeoJson,
    label: 'geojson',
  },
]
