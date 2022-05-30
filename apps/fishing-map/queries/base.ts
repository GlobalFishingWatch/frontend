import { BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { GFWAPI, ResponseError } from '@globalfishingwatch/api-client'

export const gfwBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string
      signal?: AbortSignal
    },
    unknown,
    unknown
  > =>
  async ({ url, signal }) => {
    try {
      const data = await GFWAPI.fetch(baseUrl + url, { signal })
      return { data }
    } catch (gfwApiError) {
      const err = gfwApiError as ResponseError
      return {
        error: { status: err?.status, data: err?.message },
      }
    }
  }
