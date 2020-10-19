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

export interface SearchEntry<T = any> {
  dataset: string
  results: SearchResult<T>
}

export type APISearch<T> = SearchEntry<T>[]
