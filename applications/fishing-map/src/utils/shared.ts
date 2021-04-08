export const capitalize = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const toFixed = (value: number, decimals = 2) => {
  if (typeof value !== 'number' || typeof value !== 'string') {
    console.warn('Value not valid be fixed parsed, returning original value', value)
    return value
  }
  return (Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals)
}
