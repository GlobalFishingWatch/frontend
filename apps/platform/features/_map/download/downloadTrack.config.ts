import type { ChoiceOption } from '@globalfishingwatch/ui-components'

export enum Format {
  Csv = 'CSV',
  GeoJson = 'GEOJSON',
  Kml = 'KML',
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
  {
    id: Format.Kml,
    label: 'kml',
  },
]
