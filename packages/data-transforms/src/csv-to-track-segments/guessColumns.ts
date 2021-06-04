const GUESS_COLUMN_NAMES: [string, string[]][] = [
  ['latitude', ['latitude', 'lat', 'location-lat']],
  ['longitude', ['longitude', 'lng', 'lon', 'long', 'location-lng']],
  ['timestamp', ['timestamp', 'time', 'date', 'datetime']],
]

const guessColumns = (columns: string[] | undefined) => {
  if (!columns) return {}
  const guessedColumns = GUESS_COLUMN_NAMES.map(([columnToGuess, candidates]) => {
    const exactGuess = columns?.find((column) => candidates.includes(column))

    let approximateGuess
    if (!exactGuess) {
      approximateGuess = columns?.find((column) =>
        candidates.find((candidate) => new RegExp(candidate).test(column))
      )
    }
    return [columnToGuess, exactGuess || approximateGuess]
  })

  return Object.fromEntries(guessedColumns)
}

export default guessColumns
