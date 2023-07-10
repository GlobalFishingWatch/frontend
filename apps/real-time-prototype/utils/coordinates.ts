export const getCoordinatesLabel = (coordinates: number[]) => {
  return coordinates.map((c) => c.toFixed(5)).join(', ')
}
