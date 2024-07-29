import { ChoiceOption } from '@globalfishingwatch/ui-components'

export enum Format {
  Csv = 'CSV',
  GeoJson = 'GEOJSON',
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
