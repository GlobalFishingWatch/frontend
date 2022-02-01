import { HOME } from 'routes'
import { QueryParams } from 'types/app.types'

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

export type RouterActions = UpdateQueryParamsAction

export function updateQueryParams(query: QueryParams): UpdateQueryParamsAction {
  return { type: HOME, query }
}

const routeActions = { updateQueryParams }

export default routeActions
