import type { BaseQueryFn } from '@reduxjs/toolkit/query/react'

import type { ParsedAPIError} from '@globalfishingwatch/api-client';
import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'

export const gfwBaseQuery =
  <Response = any>(
    { baseUrl, method }: { baseUrl: string; method?: 'GET' | 'POST' | 'PATCH' } = {
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
      if (!data) {
        return { data: body }
      }
      return { data }
    } catch (gfwApiError: any) {
      return {
        error: parseAPIError(gfwApiError),
      }
    }
  }
