export const POINT_SIZES_DEFAULT_RANGE = [3, 15]
export const DEFAULT_USER_TILES_MAX_ZOOM = 9

const HIDDEN_KEYS = ['gfw_id', 'bbox', 'layerName']
export const getPropertiesList = (properties: Record<string, any>) => {
  const keys = Object.keys(properties)
    .filter((k) => !HIDDEN_KEYS.includes(k))
    .sort()
  return keys
    .flatMap((prop) => (properties?.[prop] ? `${prop}: ${properties?.[prop]}` : []))
    .join('<br/>')
}
