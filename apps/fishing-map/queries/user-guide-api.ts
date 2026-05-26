import { createApi } from '@reduxjs/toolkit/query/react'

import type { Locale } from '@globalfishingwatch/api-types'

import { getUserGuideContent } from 'features/cms/loaders/user-guide'
import type { UserGuideContent } from 'features/cms/loaders/user-guide.types'

type UserGuideParams = { locale: Locale }

export const userGuideApi = createApi({
  reducerPath: 'userGuideApi',
  baseQuery: async (args: UserGuideParams) => {
    try {
      const response = await getUserGuideContent({ data: args })
      return { data: response?.data ?? [] }
    } catch (e) {
      return { error: e }
    }
  },
  endpoints: (builder) => ({
    getUserGuide: builder.query<UserGuideContent, UserGuideParams>({
      query: ({ locale }) => ({ locale }),
    }),
  }),
})

export const { useGetUserGuideQuery } = userGuideApi
