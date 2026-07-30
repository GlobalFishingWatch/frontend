import { createApi } from '@reduxjs/toolkit/query/react'

import type { Locale } from '@globalfishingwatch/api-types'

import type { UserGuideContent } from 'features/cms/loaders/user-guide.types'

type UserGuideParams = { locale: Locale }

export const userGuideApi = createApi({
  reducerPath: 'userGuideApi',
  baseQuery: async (args: UserGuideParams) => {
    try {
      // Loaded here, not statically: store.ts imports this module's middleware via the queries barrel,
      // so a static import puts @strapi/client in the entry chunk of every page.
      const { getUserGuideContent } = await import('features/cms/loaders/user-guide')
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
