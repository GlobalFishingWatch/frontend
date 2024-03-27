import { BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { GFWAPI, ParsedAPIError, parseAPIError } from '@globalfishingwatch/api-client'

export const gfwBaseQuery =
  <Response = any>(
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
    Response,
    ParsedAPIError
  > =>
  async ({ url, signal, body }) => {
    try {
      const data = await GFWAPI.fetch<Response>(baseUrl + url, { signal, method, body })
      return { data }
    } catch (gfwApiError: any) {
      return {
        error: parseAPIError(gfwApiError),
      }
    }
  }
