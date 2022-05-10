import { createApi } from '@reduxjs/toolkit/query/react'
import { stringify } from 'qs'
import { gfwBaseQuery } from 'queries/base'
import type { BaseQueryArg, BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import type { SerializeQueryArgs } from '@reduxjs/toolkit/dist/query/defaultSerializeQueryArgs'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { Range } from 'features/timebar/timebar.slice'

export type StatField = 'flag' | 'vessel_id' | 'geartype'
export type StatFields = {
  [key in StatField]: number
}

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

// Define a service using a base URL and expected endpoints
export const dataviewStatsApi = createApi({
  reducerPath: 'dataviewStatsApi',
  serializeQueryArgs: serializeStatsDataviewKey,
  baseQuery: gfwBaseQuery({
    baseUrl: '/proto/4wings/stats',
  }),
  endpoints: (builder) => ({
    getStatsByDataview: builder.query<StatFields, FetchDataviewStatsParams>({
      query: ({ dataview, timerange, fields = ['vessel_id', 'flag'] }) => {
        const statsParams = {
          datasets: [dataview.config?.datasets?.join(',') || []],
          filters: [dataview.config?.filter] || [],
          'date-range': [timerange.start, timerange.end].join(','),
        }
        return {
          url: `?fields=${fields.join(',')}&${stringify(statsParams, {
            arrayFormat: 'indices',
          })}`,
        }
      },
      transformResponse: (response: StatFields[]) => {
        return response?.[0]
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetStatsByDataviewQuery } = dataviewStatsApi
