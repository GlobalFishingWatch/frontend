import type { DatasetFilter, DatasetFilters } from '@globalfishingwatch/api-types'
import { getFlattenDatasetFilters } from '@globalfishingwatch/datasets-client'

export type GuessColumn = 'latitude' | 'longitude' | 'timestamp'
export type VesselPropertyGuessColumn = 'vesselId' | 'mmsi' | 'imo' | 'flag'

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

export const VesselIdMatches = ['vesselId', 'vesselid', 'vessel_id', 'id']
export const MmsiMatches = ['mmsi', 'ssvid']
export const ImoMatches = ['imo']
export const FlagMatches = ['flag', 'bandera', 'pavillon', 'bandeira']

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

export const VESSEL_PROPERTY_GUESS_COLUMN_DICT: Record<VesselPropertyGuessColumn, string[]> = {
  vesselId: matchesWithUpperCase(VesselIdMatches),
  mmsi: matchesWithUpperCase(MmsiMatches),
  imo: matchesWithUpperCase(ImoMatches),
  flag: matchesWithUpperCase(FlagMatches),
}

export const GUESS_COLUMN_NAMES = Object.entries(GUESS_COLUMN_DICT)

export const resolveVesselPropertyColumn = (header: string): VesselPropertyGuessColumn | null => {
  const normalized = header.trim().toLowerCase()
  for (const col of Object.keys(VESSEL_PROPERTY_GUESS_COLUMN_DICT) as VesselPropertyGuessColumn[]) {
    if (
      VESSEL_PROPERTY_GUESS_COLUMN_DICT[col].some((alias) => alias.toLowerCase() === normalized)
    ) {
      return col
    }
  }
  return null
}

export const guessColumn = (col: GuessColumn, options: string[] = []) => {
  return options.find((option) => GUESS_COLUMN_DICT[col].includes(option))
}

export const guessColumnsFromFilters = (
  filters: Record<string, DatasetFilter> | DatasetFilters | null | undefined
): Record<GuessColumn, string | null> => {
  const emptyGuessedColumns = {} as Record<GuessColumn, string | null>
  if (!filters) {
    return emptyGuessedColumns
  }

  const flattenedFilters = getFlattenDatasetFilters(filters)
  const columns = flattenedFilters.map((filter) => filter.id)
  if (!columns.length) {
    return emptyGuessedColumns
  }
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

  return Object.fromEntries(guessedColumns) as Record<GuessColumn, string | null>
}
