export interface PaginatedResult<T = any> {
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

export type APIPagination<T> = PaginatedResult<T>
