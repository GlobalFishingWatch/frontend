import { createApi } from '@reduxjs/toolkit/query/react'
import { injectQueryApi } from 'queries/inject-api'

import type { Locale } from '@globalfishingwatch/api-types'

import type { UseCaseContent } from 'features/cms/loaders/use-case.types'

type UseCaseParams = { locale: Locale }

export const useCaseApi = createApi({
  reducerPath: 'useCaseApi',
  baseQuery: async (args: UseCaseParams) => {
    try {
      const { getUseCaseContent } = await import('features/cms/loaders/use-case')
      const response = await getUseCaseContent({ data: args })
      return { data: response?.data ?? [] }
    } catch (e) {
      return { error: e }
    }
  },
  endpoints: (builder) => ({
    getUseCases: builder.query<UseCaseContent, UseCaseParams>({
      query: ({ locale }) => ({ locale }),
    }),
  }),
})

injectQueryApi(useCaseApi)

export const { useGetUseCasesQuery } = useCaseApi
