import { ChoiceOption } from '@globalfishingwatch/ui-components/dist/choice'

export enum Format {
  Csv = 'csv',
  GeoJson = 'geo.json',
}

export const FORMAT_OPTIONS: ChoiceOption[] = [
  {
    id: Format.Csv,
    title: 'csv',
  },
  {
    id: Format.GeoJson,
    title: 'geojson',
  },
]
