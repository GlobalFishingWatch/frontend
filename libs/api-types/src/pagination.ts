export interface APIPagination<T = any> {
  entries: T[]
  metadata: {
    suggestion: string
  }
  limit: number
  nextOffset: number
  offset: number
  query: string
  total: number
}

export interface APIVesselSearchPagination<T = any> {
  entries: T[]
  limit: number
  metadata: {
    didYouMean: any
    normalizedQuery: string
    query: string
  }
  since: string | null
  total: number
}
