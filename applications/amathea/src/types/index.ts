export type WorkspaceParam = 'zoom' | 'latitude' | 'longitude' | 'start' | 'end' | 'modal'

export type ModalTypes = 'newWorkspace' | 'newAOI' | 'newDataset'

export type QueryParams = {
  [query in WorkspaceParam]?: ModalTypes | string | number | boolean | null
}

export type MapCoordinates = {
  latitude: number
  longitude: number
  zoom: number
}
