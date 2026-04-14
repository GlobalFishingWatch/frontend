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

export type TUserGuideSection = StrapiBaseAttributes & {
  title: string
  contentBlocks: ContentBlocks[]
}

export type ContentBlocks = {
  id: string
  body: string
}

export type TDataset = StrapiBaseAttributes & {
  dataset_id: string
  name: string
  description: string
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

export function castSidePanelData<K extends keyof SidePanelContentTypeMap>(
  _content: K,
  data: TUserGuideSection | TDataset
): SidePanelContentTypeMap[K] {
  return data as SidePanelContentTypeMap[K]
}

export function isTUserGuideSection(item: unknown): item is TUserGuideSection {
  return typeof item === 'object' && item !== null && 'contentBlocks' in item
}

export function isTDataset(item: unknown): item is TDataset {
  return typeof item === 'object' && item !== null && 'dataset_id' in item
}
