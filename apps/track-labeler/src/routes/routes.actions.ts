import type { QueryParams } from '../types'

import { HOME } from './routes'

export interface UpdateQueryParamsAction {
  type: typeof HOME
  query: QueryParams
  replaceQuery?: boolean
  meta?: {
    location: {
      kind: string
    }
  }
}

export function updateQueryParams(query: QueryParams): UpdateQueryParamsAction {
  return { type: HOME, query }
}
