import { createApi } from '@reduxjs/toolkit/query/react'
import { gfwBaseQuery } from './base'

type LabellingProjectsApiParams = {
  projectId: string
  limit: number
}

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: gfwBaseQuery({
    baseUrl: '/labelling-projects',
  }),
  endpoints: (builder) => ({
    getLabellingProjectTasks: builder.query({
      query: ({ projectId, limit }: LabellingProjectsApiParams) => {
        return {
          url: `/${projectId}/task?limit=${limit}`,
        }
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetLabellingProjectTasksQuery } = projectApi
