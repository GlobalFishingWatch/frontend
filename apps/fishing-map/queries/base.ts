import { BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'

export const gfwBaseQuery =
  (
    { baseUrl, method }: { baseUrl: string; method?: 'GET' | 'POST' } = {
      baseUrl: '',
      method: 'GET',
    }
  ): BaseQueryFn<
    {
      url: string
      signal?: AbortSignal
      body?: any
    },
    unknown,
    unknown
  > =>
  async ({ url, signal, body }) => {
    try {
      const data = await GFWAPI.fetch(baseUrl + url, { signal, method, body })
      return { data }
    } catch (gfwApiError: any) {
      return {
        error: parseAPIError(gfwApiError),
      }
    }
  }
