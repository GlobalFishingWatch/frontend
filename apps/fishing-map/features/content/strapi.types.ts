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
