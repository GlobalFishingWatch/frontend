export interface APIPagination<T = any> {
  entries: T[]
  metadata: {
    suggestion: string
    datasets: string[]
  }
  limit: number
  nextOffset: number
  offset: number
  query: string
  total: number
}
