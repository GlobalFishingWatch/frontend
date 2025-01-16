import { createApi } from '@reduxjs/toolkit/query/react'
import type { LabellingProject } from 'apps/image-labeler/src/types'

import { gfwBaseQuery } from './base'

// Define a service using a base URL and expected endpoints
export const projectEditApi = createApi({
  reducerPath: 'projectEditApi',
  baseQuery: gfwBaseQuery({
    baseUrl: `/labelling-projects`,
    method: 'PATCH',
  }),
  endpoints: (builder) => ({
    editProject: builder.mutation<any, LabellingProject>({
      query: (body) => {
        const { id, ...rest } = body
        return {
          url: `/${id}`,
          method: 'PATCH',
          body: rest,
        }
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useEditProjectMutation } = projectEditApi
