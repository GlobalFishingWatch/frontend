import { createApi } from '@reduxjs/toolkit/query/react'

import { gfwBaseQuery } from './base'

export type TaskParams = {
  projectId: string
  taskId: string
  label: string
}

// Define a service using a base URL and expected endpoints
export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: gfwBaseQuery({
    baseUrl: `/labelling-projects`,
    method: 'POST',
  }),
  endpoints: (builder) => ({
    setTask: builder.mutation<any, TaskParams>({
      query: (body) => ({
        url: `/${body.projectId}/task`,
        method: 'POST',
        body: { id: body.taskId, label: body.label },
      }),
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useSetTaskMutation } = taskApi
