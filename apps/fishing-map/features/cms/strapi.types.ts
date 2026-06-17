export type StrapiResponse<T = null> = {
  data?: T[]
  error?: StrapiError
  meta?: {
    pagination?: StrapiPagination
  }
}

export type StrapiBaseAttributes = {
  id: string
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  localizations: string[]
}

export type StrapiImage = {
  id: number
  documentId: string
  alternativeText: string | null
  url: string
}
export type StrapiPagination = {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export type StrapiError = {
  status: number
  name: string
  message: string
  details?: Record<string, string[]>
}
