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
}

export type TUserGuideSubSection = StrapiBaseAttributes & {
  title: string
  body: string
  slug?: string
}

export type TUserGuideSection = TUserGuideSubSection & {
  subsections: TUserGuideSubSection[]
}

export type TDataset = StrapiBaseAttributes & {
  dataset_id: string
  name: string
  description: string
  slug?: string
  filters: Filters
  filters_i18n?: FiltersI18n
}
export type FilterField = {
  enum: string[]
  label: string
}

export type Filters = Record<string, FilterField>

export type FilterTranslation = {
  label?: string
  enum?: Record<string, string>
}

export type FiltersI18n = Record<string, FilterTranslation>

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
