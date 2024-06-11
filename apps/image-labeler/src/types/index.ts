export type LabellingProject = {
  id?: number
  name: string
  labels: string[]
  bqQuery: string
  bqTable: string
  gcsThumbnails: string
}

export type LabellingTask = {
  id: string
  labels: string[]
  metadata: {
    score: number
  }
  thumbnails: string[]
}
