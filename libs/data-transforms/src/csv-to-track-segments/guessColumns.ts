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

export const guessColumn = (col: GuessColumn, options: string[]) => {
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
