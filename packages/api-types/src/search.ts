export interface SearchResult<T = any> {
  entries: T[]
  metadata: {
    suggestion: string
  }
  limit: number
  nextOffset: number
  offset: number
  query: string
  total: {
    value: number
    relation: string
  }
}

export type APISearch<T> = SearchResult<T>
