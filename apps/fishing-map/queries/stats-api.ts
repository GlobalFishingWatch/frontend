import type { FetchBaseQueryArgs, SerializeQueryArgs } from '@reduxjs/toolkit/query/react'
import { createApi } from '@reduxjs/toolkit/query/react'
import { uniq } from 'es-toolkit'
import { DateTime } from 'luxon'
import { stringify } from 'qs'
import { gfwBaseQuery } from 'queries/base'

import type { StatFields, StatsParams, StatType } from '@globalfishingwatch/api-types'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { getDatasetsExtent } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import type { TimeRange } from 'features/timebar/timebar.slice'

type FetchDataviewStatsParams = {
  timerange: TimeRange
  dataview: UrlDataviewInstance
  fields?: StatsParams[]
}

interface CustomBaseQueryArg extends FetchBaseQueryArgs {
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

// Define a service using a base URL and expected endpoints
export const dataviewStatsApi = createApi({
  reducerPath: 'dataviewStatsApi',
  baseQuery: gfwBaseQuery({
    baseUrl: `/4wings/stats`,
  }),
  endpoints: (builder) => ({
    getStatsByDataview: builder.query<StatFields, FetchDataviewStatsParams>({
      serializeQueryArgs: serializeStatsDataviewKey,
      query: ({ dataview, timerange, fields }) => {
        const datasets = dataview.datasets?.filter((dataset) =>
          dataview.config?.datasets?.includes(dataset.id)
        )
        const { extentStart, extentEnd = getUTCDate(Date.now()).toISOString() } =
          getDatasetsExtent<string>(datasets)
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
          'date-range': [laterStartDate.toISODate(), earlierEndDate.toISODate()].join(','),
          ...(fields?.length && {
            fields: fields.join(','),
          }),
          ...(dataview.config?.filter && { filters: [dataview.config?.filter] }),
          ...(dataview.config?.['vessel-groups'] && {
            'vessel-groups': [dataview.config?.['vessel-groups']],
          }),
        }
        return {
          url: `?${stringify(statsParams, {
            arrayFormat: 'indices',
          })}`,
        }
      },
      transformResponse: (response: StatFields[], meta, args) => {
        if (!args.fields?.length) {
          return response?.[0]
        }
        const units = uniq(args?.dataview?.datasets?.flatMap((d) => d.unit || []) || [])
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
