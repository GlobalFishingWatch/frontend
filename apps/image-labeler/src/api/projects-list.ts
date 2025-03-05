import { createApi } from '@reduxjs/toolkit/query/react'

import { gfwBaseQuery } from './base'

export const projectsListApi = createApi({
  reducerPath: 'projectsListApi',
  baseQuery: gfwBaseQuery({
    baseUrl: '/labelling-projects',
  }),
  endpoints: (builder) => ({
    getLabellingProjectsList: builder.query({
      query: () => {
        return {
          url: '',
        }
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetLabellingProjectsListQuery } = projectsListApi
