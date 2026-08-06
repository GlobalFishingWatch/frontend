export function getViewportHash({
  viewport,
  precissionDecimals = 3,
}: {
  viewport: {
    zoom: number
    longitude?: number
    latitude?: number
    width?: number
    height?: number
  }
  precissionDecimals?: number
}) {
  const { longitude, latitude, zoom, width, height } = viewport
  return [longitude, latitude, zoom, width, height]
    .flatMap((n) => n?.toFixed(precissionDecimals) || [])
    .join(',')
}
