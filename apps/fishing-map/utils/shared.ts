export const capitalize = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const toFixed = (value: number, decimals = 2) => {
  if (typeof value !== 'number') {
    console.warn('Value not valid be fixed parsed, returning original value', value)
    return value
  }
  return (Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals)
}

export type Field = { id: string; label: string | number }
export const sortFields = (a: Field, b: Field) => {
  if (typeof a.label === 'number' || typeof b.label === 'number') {
    return (a.label as number) - (b.label as number)
  }

  if (typeof a.label === 'boolean' || typeof b.label === 'boolean') {
    return 0
  }

  return a.label.localeCompare(b.label)
}
