import { createApi } from '@reduxjs/toolkit/query/react'
import type { UIMessage } from 'ai'
import { getQueryParamsResolved, gfwBaseQuery } from 'queries/base'
import { injectQueryApi } from 'queries/inject-api'

import { API_GATEWAY, API_VERSION } from '@globalfishingwatch/api-client'

export const AGENT_ID = 'main-agent'
export const AGENT_BASE_URL = `${API_GATEWAY}/${API_VERSION}/agent/workspace-navigator-agent`

const threadsQuery = gfwBaseQuery({ baseUrl: `${AGENT_BASE_URL}/threads` })
const deleteThreadQuery = gfwBaseQuery({ baseUrl: `${AGENT_BASE_URL}/threads`, method: 'DELETE' })

type AgentThread = {
  id: string
  title: string
  updatedAt: string
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: threadsQuery,
  tagTypes: ['ChatThread', 'ChatThreadMessages'],
  endpoints: (builder) => ({
    getThreads: builder.query<AgentThread[], { resourceId: string }>({
      query: ({ resourceId }) => ({
        url: getQueryParamsResolved({ agentId: AGENT_ID, resourceId }),
      }),
      transformResponse: (response: { threads?: AgentThread[] } | AgentThread[]) =>
        Array.isArray(response) ? response : (response.threads ?? []),
      providesTags: ['ChatThread'],
    }),
    getThreadMessages: builder.query<UIMessage[], { threadId: string; resourceId: string }>({
      queryFn: async ({ threadId, resourceId }, api) => {
        const result = await threadsQuery(
          {
            url: `/${encodeURIComponent(threadId)}/messages${getQueryParamsResolved({ agentId: AGENT_ID, resourceId })}`,
            signal: api.signal,
          },
          api,
          {}
        )
        if (result.error) {
          // A brand-new, never-persisted thread 404s server-side — treat as empty history, not an error.
          if (result.error.status === 404) return { data: [] }
          return { error: result.error }
        }
        const data = result.data as { uiMessages?: UIMessage[] | null }
        return { data: data.uiMessages ?? [] }
      },
      providesTags: (_result, _error, { threadId }) => [
        { type: 'ChatThreadMessages', id: threadId },
      ],
    }),
    deleteThread: builder.mutation<boolean, { threadId: string; resourceId: string }>({
      queryFn: async ({ threadId, resourceId }, api) => {
        const result = await deleteThreadQuery(
          {
            url: `/${encodeURIComponent(threadId)}${getQueryParamsResolved({ agentId: AGENT_ID, resourceId })}`,
            signal: api.signal,
          },
          api,
          {}
        )
        // A 404 (already gone) counts as a successful delete, not a failure.
        return { data: !result.error || result.error.status === 404 }
      },
      invalidatesTags: ['ChatThread'],
    }),
  }),
})

injectQueryApi(chatApi)

export const { useGetThreadsQuery, useGetThreadMessagesQuery, useDeleteThreadMutation } = chatApi
