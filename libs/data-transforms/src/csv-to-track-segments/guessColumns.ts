export type GuessColum = 'latitude' | 'longitude' | 'timestamp'

export const LatitudeMatches = ['latitude', 'lat', 'location-lat', 'LAT', 'LATITUDE']
export const LongitudeMatches = [
  'longitude',
  'lng',
  'lon',
  'long',
  'location-lng',
  'LNG',
  'LON',
  'LONG',
  'LONGITUDE',
]
export const TimestampMatches = ['timestamp', 'time', 'date', 'datetime']

export const GUESS_COLUMN_DICT: Record<GuessColum, string[]> = {
  latitude: LatitudeMatches,
  longitude: LongitudeMatches,
  timestamp: TimestampMatches,
}

export const GUESS_COLUMN_NAMES = [Object.entries(GUESS_COLUMN_DICT)]

export const guessColum = (col: GuessColum, options: string[]) => {
  return options.find((option) => GUESS_COLUMN_DICT[col].includes(option))
}

export const guessColumns = (columns: string[] | undefined) => {
  if (!columns) return {}
  const guessedColumns = GUESS_COLUMN_NAMES.map(([columnToGuess, candidates]) => {
    const exactGuess = columns?.find((column) => candidates.includes(column))

    let approximateGuess
    if (!exactGuess) {
      approximateGuess = columns?.find((column) =>
        candidates.find((candidate) => new RegExp(candidate as string).test(column))
      )
    }
    return [columnToGuess, exactGuess || approximateGuess]
  })

  return Object.fromEntries(guessedColumns)
}
