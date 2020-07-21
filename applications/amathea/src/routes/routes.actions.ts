import { QueryParams } from 'types'
import { ROUTE_TYPES } from './routes'

export interface UpdateQueryParamsAction {
  type: ROUTE_TYPES
  query: QueryParams
  replaceQuery?: boolean
  payload?: any
  meta?: {
    location: {
      kind: string
    }
  }
}

export function updateQueryParams(
  type: ROUTE_TYPES,
  { query, payload = {} }: { query: QueryParams; payload: any }
): UpdateQueryParamsAction {
  return { type, query, payload }
}
