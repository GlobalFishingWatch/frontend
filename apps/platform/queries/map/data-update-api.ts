import { createApi } from '@reduxjs/toolkit/query/react'
import { injectQueryApi } from 'queries/inject-api'

import type { Locale } from '@globalfishingwatch/api-types'

import type { DataUpdateContent } from 'features/cms/loaders/data-update.types'

type DataUpdateParams = { locale: Locale }

export const dataUpdateApi = createApi({
  reducerPath: 'dataUpdateApi',
  baseQuery: async (args: DataUpdateParams) => {
    try {
      const { getDataUpdateContent } = await import('features/cms/loaders/data-update')
      const response = await getDataUpdateContent({ data: args })
      return { data: response?.data ?? [] }
    } catch (e) {
      return { error: e }
    }
  },
  endpoints: (builder) => ({
    getDataUpdates: builder.query<DataUpdateContent, DataUpdateParams>({
      query: ({ locale }) => ({ locale }),
    }),
  }),
})

injectQueryApi(dataUpdateApi)

export const { useGetDataUpdatesQuery } = dataUpdateApi
