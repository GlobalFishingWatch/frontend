import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { getActiveDatasetsInDataview } from 'features/_map/datasets/datasets.utils'

export const getActivitySources = (dataview: UrlDataviewInstance) =>
  (getActiveDatasetsInDataview(dataview) || []).map((ds) => ds.name).join(',')

export const getActivityFilters = (filters: Record<string, any> = []) =>
  Object.keys(filters || {})
    .map((field) => ({
      field,
      value: (filters || {})[field],
    }))
    .map(({ field, value = [] }) =>
      Array.isArray(field) ? [field, (value ?? [])?.join(',')].join(': ') : field
    )

export const getEventLabel = (data: string[]) => data.join(' | ')
