export type TStrapiResponse<T = null> = {
  data?: T[]
  error?: TStrapiError
  meta?: {
    pagination?: TStrapiPagination
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

  title: string
  body: string
}

export type TUserGuideSection = StrapiBaseAttributes & {
  slug: string
}

export type TDataset = StrapiBaseAttributes & {
  dataset_id: string
  schema: object
}

// Base image type from Strapi media library
export type TImage = {
  id: number
  documentId: string
  alternativeText: string | null
  url: string
}
export type TStrapiPagination = {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export type TStrapiError = {
  status: number
  name: string
  message: string
  details?: Record<string, string[]>
}

export type SidePanelContentTypeMap = {
  userGuide: TUserGuideSection
  datasets: TDataset
}
