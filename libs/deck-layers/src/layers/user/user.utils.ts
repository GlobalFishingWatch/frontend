const HIDDEN_KEYS = ['gfw_id', 'bbox']

export const getPropertiesList = (properties: Record<string, any>) => {
  const keys = Object.keys(properties)
    .filter((k) => !HIDDEN_KEYS.includes(k))
    .sort()
  return keys
    .flatMap((prop) => (properties?.[prop] ? `${prop}: ${properties?.[prop]}` : []))
    .join('<br/>')
}
