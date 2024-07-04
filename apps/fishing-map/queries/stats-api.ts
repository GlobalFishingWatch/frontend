import { createApi } from '@reduxjs/toolkit/query/react'
import { stringify } from 'qs'
import type { BaseQueryArg, BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import type { SerializeQueryArgs } from '@reduxjs/toolkit/dist/query/defaultSerializeQueryArgs'
import { gfwBaseQuery } from 'queries/base'
import { uniq } from 'lodash'
import { DateTime } from 'luxon'
import { getDatasetsExtent, type UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { StatField, StatFields, StatType, StatsParams } from '@globalfishingwatch/api-types'
import type { TimeRange } from 'features/timebar/timebar.slice'

type FetchDataviewStatsParams = {
  timerange: TimeRange
  dataview: UrlDataviewInstance
  fields?: StatField[]
}

interface CustomBaseQueryArg extends BaseQueryArg<BaseQueryFn> {
  dataview: UrlDataviewInstance
  timerange: TimeRange
}
const serializeStatsDataviewKey: SerializeQueryArgs<CustomBaseQueryArg> = ({ queryArgs }) => {
  return [
    queryArgs.dataview?.id,
    JSON.stringify(queryArgs.dataview?.config),
    JSON.stringify(queryArgs.timerange),
  ].join('-')
}

const DEFAULT_STATS_FIELDS: StatsParams[] = ['VESSEL-IDS', 'FLAGS']
// Define a service using a base URL and expected endpoints
export const dataviewStatsApi = createApi({
  reducerPath: 'dataviewStatsApi',
  baseQuery: gfwBaseQuery({
    baseUrl: `/4wings/stats`,
  }),
  endpoints: (builder) => ({
    getStatsByDataview: builder.query<StatFields, FetchDataviewStatsParams>({
      serializeQueryArgs: serializeStatsDataviewKey,
      query: ({ dataview, timerange, fields = DEFAULT_STATS_FIELDS }) => {
        const datasets = dataview.datasets?.filter((dataset) =>
          dataview.config?.datasets?.includes(dataset.id)
        )
        const { extentStart, extentEnd = new Date().toISOString() } = getDatasetsExtent(datasets)
        const laterStartDate = DateTime.max(
          DateTime.fromISO(timerange.start),
          DateTime.fromISO(extentStart as string)
        )
        const earlierEndDate = DateTime.min(
          DateTime.fromISO(timerange.end),
          DateTime.fromISO(extentEnd as string)
        )
        const statsParams = {
          datasets: [dataview.config?.datasets?.join(',') || []],
          filters: [dataview.config?.filter] || [],
          'vessel-groups': [dataview.config?.['vessel-groups']] || [],
          'date-range': [laterStartDate.toISODate(), earlierEndDate.toISODate()].join(','),
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
