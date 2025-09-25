import get from 'lodash/get'

import { getUTCDateTime } from 'utils/dates'

export type CsvConfig = {
  label: string
  accessor: string | string[]
  transform?: (value: any) => any
}

export const parseCSVString = (string: string | number) => {
  return string?.toString()?.replaceAll(',', '-')
}
export const parseCSVDate = (date: number) => getUTCDateTime(date).toISO()
export const parseCSVList = (value: string[]) => value?.join('|')

export const objectArrayToCSV = (
  data: unknown[],
  csvConfig: CsvConfig[],
  getter = get as (any: any, path: string) => any
) => {
  const keys = csvConfig.map((c) => c.label).join(',')
  const values = data.map((d) => {
    return csvConfig
      .map(({ accessor, transform }) => {
        const value = Array.isArray(accessor)
          ? accessor.map((a) => getter(d, a)).filter(Boolean)[0]
          : getter(d, accessor)
        const transformedValue = transform ? transform(value) : value
        return transformedValue ? parseCSVString(transformedValue) : ''
      })
      .join(',')
  })
  return [keys, values.join('\n')].join('\n')
}
