import { createApi } from '@reduxjs/toolkit/query/react'

import { gfwBaseQuery } from './base'

type LabellingProjectsApiParams = {
  projectId: string
  limit: number
}

type LabellingProjectsByIdApiParams = {
  projectId: string
  taskId: string
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
    getLabellingProjectTasksById: builder.query({
      query: ({ projectId, taskId }: LabellingProjectsByIdApiParams) => {
        return {
          url: `/${projectId}/task/${taskId}`,
        }
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetLabellingProjectTasksQuery, useGetLabellingProjectTasksByIdQuery } = projectApi
