import { parse } from 'papaparse'

const GUESS_COLUMN_NAMES: [string, string[]][] = [
  ['latitude', ['latitude', 'lat', 'location-lat']],
  ['longitude', ['longitude', 'lng', 'long']],
  ['timestamp', ['timestamp', 'time', 'date', 'datetime']],
]

const guessColumns = (rawCsv: string) => {
  const d = parse(rawCsv, { dynamicTyping: true, header: true })

  // const firstRow = d.data[0]

  const columns = d.meta.fields

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
