import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

export const getActivitySources = (dataview: UrlDataviewInstance) =>
  (dataview.datasets || [])
    .filter((ds) => (dataview.config?.datasets || []).includes(ds.id))
    .map((ds) => ds.name)
    .join(',')

export const getActivityFilters = (filters: Record<string, any> = []) =>
  Object.keys(filters || {})
    .map((field) => ({
      field,
      value: (filters || {})[field],
    }))
    .map(({ field, value = [] }) => [field, (value ?? [])?.join(',')].join(': '))

export const getEventLabel = (data: string[]) => data.join('|')
