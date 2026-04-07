export type StrapiBaseAttributes = {
  id: string
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  localizations: string[]
}

export type StrapiResponse<T> = {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export type UserGuideSection = StrapiBaseAttributes & {
  title: string
  contentBlocks: ContentBlocks[]
}

export type Topics = StrapiBaseAttributes & {
  title: string | null
  description: string | null
}

export type ContentBlocks = {
  id: string
  body: string
}

// Base image type from Strapi media library
export type TImage = {
  id: number
  documentId: string
  alternativeText: string | null
  url: string
}

// Author content type
export type TDataset = {
  id: string
  documentId: string
  dataset_id: string
  name: string
  description: string
  schema: object
  createdAt: string
  updatedAt: string
  publishedAt: string
}

// Category content type
export type TCategory = {
  id: number
  documentId: string
  name: string
  slug: string
  description?: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

// Strapi response wrappers
export type TStrapiResponseSingle<T> = {
  data: T
  meta?: {
    pagination?: TStrapiPagination
  }
}

export type TStrapiResponseCollection<T> = {
  data: T[]
  meta?: {
    pagination?: TStrapiPagination
  }
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

export type TStrapiResponse<T = null> = {
  data?: T
  error?: TStrapiError
  meta?: {
    pagination?: TStrapiPagination
  }
}

type ParsedSchemaValue = { keyword: string; enum?: Record<string, string> }
type ParsedSchema = Record<string, ParsedSchemaValue>

export interface ParsedDataset {
  name: string
  description: string
  schema?: ParsedSchema
}
