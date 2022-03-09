import { createApi } from '@reduxjs/toolkit/query/react'
import { stringify } from 'qs'
import { gfwBaseQuery } from 'queries/base'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Range } from 'features/timebar/timebar.slice'

export type StatField = 'flag' | 'vessel_id' | 'geartype'
export type StatFields = {
  [key in StatField]: number
}
export type DataviewStats = {
  [key: string]: StatFields
}

export type FetchDataviewStatsParams = {
  timerange: Range
  dataview: UrlDataviewInstance
  fields?: StatField[]
}

// Define a service using a base URL and expected endpoints
export const dataviewStatsApi = createApi({
  reducerPath: 'dataviewStatsApi',
  baseQuery: gfwBaseQuery({
    baseUrl: '/proto/4wings/stats',
  }),
  endpoints: (builder) => ({
    getStatsByDataview: builder.query<DataviewStats, FetchDataviewStatsParams>({
      query: ({ dataview, timerange, fields = ['vessel_id', 'flag'] }) => {
        const statsParams = {
          datasets: [dataview.config?.datasets?.join(',') || []],
          filters: dataview.config?.filter || [],
          'date-range': [timerange.start, timerange.end].join(','),
        }
        return {
          url: `?fields=${fields.join(',')}&${stringify(statsParams, {
            arrayFormat: 'indices',
          })}`,
        }
      },
      transformResponse: (response: DataviewStats[], meta, arg) => {
        return response?.[0]
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetStatsByDataviewQuery } = dataviewStatsApi
