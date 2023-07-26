export const getCoordinatesLabel = (coordinates: number[]) => {
  return coordinates.map((c) => c.toFixed(5)).join(', ')
}

export const convertToTrackCSV = (arr: any[]) => {
  const keys = ['lon', 'lat', 'timestamp'].join(',')
  const values = arr.map((row) => [row.coordinates[0], row.coordinates[1], row.timestamp].join(','))
  return [keys, values.join('\n')].join('\n')
}
