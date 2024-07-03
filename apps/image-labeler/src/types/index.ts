export type LabellingProject = {
  id?: number
  name: string
  labels: string[]
  bqQuery: string
  bqTable: string
  gcsThumbnails: string
  scale: string
}

export type LabellingTask = {
  id: string
  labels: string[]
  metadata: Record<string, any>
  thumbnails: string[]
}
