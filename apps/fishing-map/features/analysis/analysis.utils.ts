/**
 *
 * @param filters Dataview filters
 * @returns Conditions transformed to apply in the API request and
 *          joined by AND operator
 */
import { format } from 'd3-format'
import { DateTime } from 'luxon'
import { Interval } from '@globalfishingwatch/layer-composer'
import { formatI18nNumber } from 'features/i18n/i18nNumber'

export const transformFilters = (filters: Record<string, any>): string => {
  const queryFiltersFields = [
    {
      value: filters.flag,
      field: 'flag',
      operator: 'IN',
      transformation: (value: any): string =>
        `(${(value as string[])?.map((v: string) => `'${v}'`).join(', ')})`,
    },
    {
      value: filters.fleet,
      field: 'fleet',
      operator: 'IN',
      transformation: (value: any): string =>
        `(${(value as string[])?.map((v: string) => `'${v}'`).join(', ')})`,
    },
    {
      value: filters.origin,
      field: 'origin',
      operator: 'IN',
      transformation: (value: any): string =>
        `(${(value as string[])?.map((v: string) => `'${v}'`).join(', ')})`,
    },
    {
      value: filters.geartype,
      field: 'geartype',
      operator: 'IN',
      transformation: (value: any): string =>
        `(${(value as string[])?.map((v: string) => `'${v}'`).join(', ')})`,
    },
    {
      value: filters.vessel_type,
      field: 'vessel_type',
      operator: 'IN',
      transformation: (value: any): string =>
        `(${(value as string[])?.map((v: string) => `'${v}'`).join(', ')})`,
    },
  ]

  return queryFiltersFields
    .filter(({ value }) => value && value !== undefined)
    .map(
      ({ field, operator, transformation, value }) =>
        `${field} ${operator} ${transformation ? transformation(value) : `'${value}'`}`
    )
    .join(' AND ')
}

export const tickFormatter = (tick: number) => {
  const formatter = tick < 1 && tick > -1 ? '~r' : '~s'
  return format(formatter)(tick)
}

export const formatDate = (date: DateTime, timeChunkInterval: Interval | string) => {
  let formattedLabel = ''
  switch (timeChunkInterval) {
    case 'month':
    case 'months':
      formattedLabel += date.toFormat('LLLL y')
      break
    case '10days':
      const timeRangeStart = date.toLocaleString(DateTime.DATE_MED)
      const timeRangeEnd = date.plus({ days: 9 }).toLocaleString(DateTime.DATE_MED)
      formattedLabel += `${timeRangeStart} - ${timeRangeEnd}`
      break
    case 'day':
    case 'days':
      formattedLabel += date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
      break
    default:
      formattedLabel += date.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
      break
  }
  return formattedLabel
}

export const formatTooltipValue = (value: number, unit: string, asDifference = false) => {
  if (value === undefined) {
    return null
  }
  const valueFormatted = formatI18nNumber(value, { maximumFractionDigits: 2 })
  const valueLabel = `${value > 0 && asDifference ? '+' : ''}${valueFormatted} ${unit ? unit : ''}`
  return valueLabel
}
