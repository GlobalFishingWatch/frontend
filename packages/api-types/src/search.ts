export interface SearchResult<T = any> {
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

export type APISearch<T> = SearchResult<T>
