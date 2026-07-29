import { createApi } from '@reduxjs/toolkit/query/react'

import type { Locale } from '@globalfishingwatch/api-types'

import { getDataTerminologyContent } from 'features/cms/loaders/data-terminology'
import type { DataTerminology } from 'features/cms/loaders/data-terminology.types'

type DataTerminologyParams = { id: string; locale: Locale }

export const dataTerminologyApi = createApi({
  reducerPath: 'dataTerminologyApi',
  baseQuery: async (args: DataTerminologyParams) => {
    try {
      const response = await getDataTerminologyContent({ data: args })
      return { data: response?.data?.[0] ?? null }
    } catch (e) {
      return { error: e }
    }
  },
  endpoints: (builder) => ({
    getDataTerminologyContent: builder.query<DataTerminology, DataTerminologyParams>({
      query: ({ id, locale }) => ({ id, locale }),
    }),
  }),
})

export const { useGetDataTerminologyContentQuery } = dataTerminologyApi
