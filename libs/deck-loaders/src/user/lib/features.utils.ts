import type { FilterOperator } from '@globalfishingwatch/api-types'

export type FilterOperators = Record<string, FilterOperator>

export function isNumeric(str: string | number) {
  if (!str) return false
  if (typeof str == 'number') return true
  return !isNaN(parseFloat(str))
}

export function isFeatureInFilter(
  feature: any,
  { id, values, operator }: { id: string; values: any; operator?: FilterOperator }
) {
  if (!values) return true
  if (
    values.length === 2 &&
    isNumeric(values[0]) &&
    isNumeric(values[1]) &&
    // this is needed because protected_seas layer has a numeric filter that comes as a string
    id !== 'removal_of'
  ) {
    const min = parseFloat(values[0] as string)
    const max = parseFloat(values[1] as string)
    const value = Number(feature?.properties?.[id])
    return value && value >= min && value < max
  } else {
    if (operator === 'exclude') {
      return !values.includes(feature?.properties?.[id])
    }
    return (
      feature?.properties?.[id] &&
      values.includes(
        typeof feature?.properties?.[id] === 'string'
          ? feature?.properties?.[id]
          : feature?.properties?.[id].toString()
      )
    )
  }
}

export function isFeatureInFilters(
  feature: any,
  filters?: Record<string, any>,
  filterOperators?: FilterOperators
) {
  if (!filters || !Object.keys(filters).length) return true
  return Object.entries(filters).every(([id, values]) => {
    return isFeatureInFilter(feature, { id, values, operator: filterOperators?.[id] })
  })
}
