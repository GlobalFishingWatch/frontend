import { createApi } from '@reduxjs/toolkit/query/react'
import type { LabellingProject } from 'apps/image-labeler/src/types'

import { gfwBaseQuery } from './base'

// Define a service using a base URL and expected endpoints
export const projectCreateApi = createApi({
  reducerPath: 'projectCreateApi',
  baseQuery: gfwBaseQuery({
    baseUrl: `/labelling-projects`,
    method: 'POST',
  }),
  endpoints: (builder) => ({
    createProject: builder.mutation<any, LabellingProject>({
      query: (body) => {
        return {
          url: '',
          method: 'POST',
          body,
        }
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useCreateProjectMutation } = projectCreateApi
