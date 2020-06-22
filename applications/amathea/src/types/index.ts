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
