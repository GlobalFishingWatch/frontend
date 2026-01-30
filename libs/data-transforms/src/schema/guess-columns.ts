import type { DatasetFilter, DatasetFilters } from '@globalfishingwatch/api-types'
import { flattenDatasetFilters } from '@globalfishingwatch/datasets-client'

export type GuessColumn = 'latitude' | 'longitude' | 'timestamp'

export const LatitudeMatches = ['latitude', 'latitud', 'lat', 'location-lat', 'y']
export const LongitudeMatches = [
  'longitude',
  'longitud',
  'lng',
  'lon',
  'long',
  'location-lng',
  'location-lon',
  'location-long',
  'x',
]
export const TimestampMatches = ['timestamp', 'fecha', 'time', 'date', 'datetime', 't']

const matchesWithUpperCase = (matches: string[]) => {
  return [
    ...matches,
    ...matches.map((match) => match.toUpperCase()),
    ...matches.map((match) => match.charAt(0).toUpperCase() + match.slice(1)),
  ]
}

export const GUESS_COLUMN_DICT: Record<GuessColumn, string[]> = {
  latitude: matchesWithUpperCase(LatitudeMatches),
  longitude: matchesWithUpperCase(LongitudeMatches),
  timestamp: matchesWithUpperCase(TimestampMatches),
}

export const GUESS_COLUMN_NAMES = Object.entries(GUESS_COLUMN_DICT)

export const guessColumn = (col: GuessColumn, options: string[] = []) => {
  return options.find((option) => GUESS_COLUMN_DICT[col].includes(option))
}

export const guessColumnsFromFilters = (
  filters: Record<string, DatasetFilter> | DatasetFilters | null | undefined
) => {
  if (!filters) return {}

  const flatSchema = flattenDatasetFilters(filters)
  const columns = flatSchema.map((filter) => filter.id)
  if (!columns.length) return {}
  const guessedColumns = GUESS_COLUMN_NAMES.map(([columnToGuess, candidates]) => {
    const exactGuess = columns?.find((column) => candidates.includes(column))
    const longEnoughCandidates = candidates.filter((c) => c.length >= 3)
    const approximateGuess =
      !exactGuess &&
      columns?.find((column) =>
        longEnoughCandidates.find((candidate) => new RegExp(candidate as string).test(column))
      )
    return [columnToGuess, exactGuess || approximateGuess || null]
  })

  return Object.fromEntries(guessedColumns)
}
