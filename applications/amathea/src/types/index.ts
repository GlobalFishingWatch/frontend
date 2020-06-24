export type WorkspaceParam = 'zoom' | 'latitude' | 'longitude' | 'start' | 'end' | 'modal'

export type QueryParams = {
  [query in WorkspaceParam]?: ModalTypes | string | number | boolean | null
}

export type ModalTypes = 'newWorkspace' | 'newAOI' | 'newDataset' | 'shareWorkspace'

export type ModalConfigOption = { title: string; component: string }

export type ModalConfigOptions = {
  [query in ModalTypes]?: ModalConfigOption
}

export type MapCoordinates = {
  latitude: number
  longitude: number
  zoom: number
}

export type Editor = { id: string; email: string }

export type WorkspaceConfig = {
  id: string
  label: string
  description?: string
  editors?: Editor[]
}

export type AOIConfig = {
  id: string
  label: string
}

export type DatasetConfig = {
  id: string
  label: string
  editors?: Editor[]
}
