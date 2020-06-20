import { QueryParams } from 'types'
import { ROUTE_TYPES } from './routes'

export interface UpdateQueryParamsAction {
  type: ROUTE_TYPES
  query: QueryParams
  replaceQuery?: boolean
  meta?: {
    location: {
      kind: string
    }
  }
}

export function updateQueryParams(type: ROUTE_TYPES, query: QueryParams): UpdateQueryParamsAction {
  return { type, query }
}
