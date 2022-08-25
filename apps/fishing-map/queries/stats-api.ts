import { createApi } from '@reduxjs/toolkit/query/react'
import { stringify } from 'qs'
import type { BaseQueryArg, BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import type { SerializeQueryArgs } from '@reduxjs/toolkit/dist/query/defaultSerializeQueryArgs'
import { gfwBaseQuery } from 'queries/base'
import { uniq } from 'lodash'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { Range } from 'features/timebar/timebar.slice'

export type StatType = 'vessels' | 'detections'
export type StatField =
  | 'id'
  | 'flag'
  | 'vessel_id'
  | 'geartype'
  | 'minLat'
  | 'minLon'
  | 'maxLat'
  | 'maxLon'
export type StatFields = {
  [key in StatField]: number
} & { type: StatType }

export type FetchDataviewStatsParams = {
  timerange: Range
  dataview: UrlDataviewInstance
  fields?: StatField[]
}

interface CustomBaseQueryArg extends BaseQueryArg<BaseQueryFn> {
  url: string
  dataview: UrlDataviewInstance
  timerange: Range
}
const serializeStatsDataviewKey: SerializeQueryArgs<CustomBaseQueryArg> = ({ queryArgs }) => {
  return [
    queryArgs.dataview?.id,
    JSON.stringify(queryArgs.dataview?.config),
    JSON.stringify(queryArgs.timerange),
  ].join('-')
}

export const DEFAULT_STATS_FIELDS = ['vessel_id', 'flag']
// Define a service using a base URL and expected endpoints
export const dataviewStatsApi = createApi({
  reducerPath: 'dataviewStatsApi',
  serializeQueryArgs: serializeStatsDataviewKey,
  baseQuery: gfwBaseQuery({
    baseUrl: `/4wings/stats`,
  }),
  endpoints: (builder) => ({
    getStatsByDataview: builder.query<StatFields, FetchDataviewStatsParams>({
      query: ({ dataview, timerange, fields = DEFAULT_STATS_FIELDS }) => {
        const statsParams = {
          datasets: [dataview.config?.datasets?.join(',') || []],
          filters: [dataview.config?.filter] || [],
          'vessel-groups': [dataview.config?.['vessel-groups']] || [],
          'date-range': [timerange.start, timerange.end].join(','),
        }
        return {
          url: `?fields=${fields.join(',')}&${stringify(statsParams, {
            arrayFormat: 'indices',
          })}`,
        }
      },
      transformResponse: (response: StatFields[], meta, args) => {
        const units = uniq(args?.dataview?.datasets?.flatMap((d) => d.unit || []))
        if (units.length > 1) {
          console.warn('Incompatible datasets stats unit, using the first type', units[0])
        }
        const type: StatType = units[0] === 'detections' ? 'detections' : 'vessels'
        return { ...response?.[0], type }
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetStatsByDataviewQuery } = dataviewStatsApi
