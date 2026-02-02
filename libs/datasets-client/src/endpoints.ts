import { API_VERSION } from '@globalfishingwatch/api-client'
import type { DatasetTypes, Endpoint, EndpointId } from '@globalfishingwatch/api-types'

import {
  CONTEXT_LAYER_ENDPOINTS,
  EVENTS_ENDPOINTS,
  FOURWINGS_ENDPOINTS,
  PM_TILES_ENDPOINTS,
  TEMPORAL_CONTEXT_LAYER_ENDPOINTS,
  THUMBNAILS_ENDPOINTS,
  TRACK_ENDPOINTS,
  USER_CONTEXT_LAYER_ENDPOINTS,
  USER_TRACKS_ENDPOINTS,
  VESSELS_ENDPOINTS,
} from './endpoints.config'

// Helper type to infer the specific endpoint from the configuration
type InferEndpoint<
  Type extends DatasetTypes,
  Id extends EndpointId,
> = (typeof ENDPOINTS_BY_TYPE)[Type] extends readonly (infer E)[]
  ? E extends { id: Id }
    ? E
    : never
  : never

// Use this dynamically with the response of the getEndpointByType like
// ExtractQueryParamIds<typeof endpoint>
export type ExtractQueryParamIds<T extends { query: any }> = T['query'][number]['id']

// Use this statically with the response of the getEndpointByType like
// QueryParamIds<DatasetTypes.Events, EndpointId.Events>
export type QueryParamIds<Type extends DatasetTypes, Id extends EndpointId> = ExtractQueryParamIds<
  InferEndpoint<Type, Id>
>

// Map EndpointParamType to TypeScript types
type ParamTypeMap = {
  string: string
  number: number
  boolean: boolean
  enum: string
  sql: string
}

// Infer TypeScript type from a single EndpointParam
type InferParamType<Param> =
  // First, check if param has an enum field with values
  Param extends { enum: readonly (infer E)[] }
    ? Param extends { array: true }
      ? E[] // enum + array = literal union array
      : E // enum without array = literal union
    : // No enum, check the base type
      Param extends { type: infer Type; array: true }
      ? Type extends keyof ParamTypeMap
        ? ParamTypeMap[Type][] // array of base type
        : never
      : Param extends { type: infer Type }
        ? Type extends keyof ParamTypeMap
          ? ParamTypeMap[Type] // base type
          : never
        : never

type QueryParamItem<T extends { query: readonly any[] }> = T['query'][number]
type QueryParamId<T extends { query: readonly any[] }> = QueryParamItem<T>['id']
type RequiredQueryParamId<T extends { query: readonly any[] }> = Extract<
  QueryParamItem<T>,
  { required: true }
>['id']
type OptionalQueryParamId<T extends { query: readonly any[] }> = Exclude<
  QueryParamId<T>,
  RequiredQueryParamId<T>
>
type QueryParamById<T extends { query: readonly any[] }, Id extends QueryParamId<T>> = Extract<
  QueryParamItem<T>,
  { id: Id }
>

// Build a typed params object from endpoint query parameters.
// Params marked as required are required object keys; others are optional keys.
export type InferQueryParams<T extends { query: readonly any[] }> = {
  [Id in RequiredQueryParamId<T>]: InferParamType<QueryParamById<T, Id>>
} & {
  [Id in OptionalQueryParamId<T>]?: InferParamType<QueryParamById<T, Id>>
} extends infer O
  ? { [K in keyof O]: O[K] } // Flatten the type for better display
  : never

export const ENDPOINTS_BY_TYPE = {
  '4wings:v1': FOURWINGS_ENDPOINTS,
  'bulk-download:v1': [],
  'insights:v1': [],
  'context-layer:v1': CONTEXT_LAYER_ENDPOINTS,
  'data-download:v1': [],
  'events:v1': EVENTS_ENDPOINTS,
  'pm-tiles:v1': PM_TILES_ENDPOINTS,
  'temporal-context-layer:v1': TEMPORAL_CONTEXT_LAYER_ENDPOINTS,
  'thumbnails:v1': THUMBNAILS_ENDPOINTS,
  'tracks:v1': TRACK_ENDPOINTS,
  'user-context-layer:v1': USER_CONTEXT_LAYER_ENDPOINTS,
  'user-tracks:v1': USER_TRACKS_ENDPOINTS,
  'vessels:v1': VESSELS_ENDPOINTS,
} as const

function replacePathVersion<T extends Endpoint>(endpoint: T, version = API_VERSION): T {
  return {
    ...endpoint,
    pathTemplate: endpoint.pathTemplate.replace('{{apiVersion}}', version),
  }
}

function replaceEndpointsVersion<T extends readonly Endpoint[]>(
  endpoints: T,
  version?: string
): Endpoint[] {
  return endpoints.map((endpoint) => replacePathVersion(endpoint, version))
}

type GetEndpointParams = { version?: string }
export const getEndpoints = ({ version = API_VERSION }: GetEndpointParams) => {
  return Object.entries(ENDPOINTS_BY_TYPE).map(([type, endpoints]) => {
    return {
      type,
      endpoints: replaceEndpointsVersion(endpoints, version),
    }
  })
}

type GetEndpointsByDataset = GetEndpointParams & {
  type: DatasetTypes
}
export const getEndpointsByDatasetType = ({ type, version }: GetEndpointsByDataset) => {
  return replaceEndpointsVersion(ENDPOINTS_BY_TYPE[type], version)
}

type GetEndpointByType = GetEndpointsByDataset & {
  endpoint: EndpointId
}

// Overloaded function signatures for better type inference
export function getEndpointByType<Type extends DatasetTypes, Id extends EndpointId>(params: {
  type: Type
  endpoint: Id
  version?: string
}): InferEndpoint<Type, Id>
export function getEndpointByType({ type, endpoint, version }: GetEndpointByType) {
  const endpoints = ENDPOINTS_BY_TYPE[type]
  const endpointFound = endpoints.find((e) => e.id === endpoint)
  if (!endpointFound) {
    throw new Error(`Endpoint ${endpoint} not found in ${type}`)
  }
  // Return the endpoint with replaced version, preserving all literal types
  return replacePathVersion(endpointFound, version)
}
