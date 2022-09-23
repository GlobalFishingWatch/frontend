export function typedKeys<T>(o: T): (keyof T)[] {
  // type cast should be safe because that's what really Object.keys() does
  return Object.keys(o) as (keyof T)[]
}

export const toFixed = (value: number, decimals = 2) => {
  if (typeof value !== 'number') {
    console.warn('Value not valid be fixed parsed, returning original value', value)
    return value
  }
  return (Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals)
}

export const sortByDate = (a: string, b: string) => {
  return new Date(a).getTime() - new Date(b).getTime()
}

export const getYearFromTmtDate = (date: number) => date.toString().substring(0, 4)