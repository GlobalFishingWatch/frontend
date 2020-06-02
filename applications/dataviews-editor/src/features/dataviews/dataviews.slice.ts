import { createSlice } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { RootState } from 'store/store'

export type EndpointType = 'track' | 'info' | 'tiles' | 'events'


export interface Endpoint {
  type: EndpointType
  urlTemplate: string
  downloadable: boolean
}

export interface Dataset {
  id: string
  endpoints?: Endpoint[]
}

export interface ViewParams {
  type: string
  [propName: string]: unknown
}

export interface DatasetParams {
  [propName: string]: unknown
}

export interface Dataview {
  id: string
  name: string
  description: string
  createdAt?: string
  updatedAt?: string
  resolvedViewParams?: ViewParams
  defaultViewParams?: ViewParams
  resolvedDatasetsParams?: DatasetParams[]
  defaultDatasetParams?: DatasetParams[]
  datasetIds?: string[]
  datasets?: Dataset[] // foreign
}

export interface EditorDataview extends Dataview {
  added: boolean
  dirty: boolean
  editing: boolean
  allEndpointsLoaded?: boolean
} 


const initialState: EditorDataview[] = [
  {
    id: 'background',
    name: 'background',
    description: 'background',
    resolvedViewParams: {
      type: Generators.Type.Background
    },
    added: true,
    dirty: false,
    editing: false
  },
  {
    id: 'basemap',
    name: 'basemap',
    description: 'basemap',
    resolvedViewParams: {
      type: Generators.Type.Basemap
    },
    added: false,
    dirty: false,
    editing: false
  },
  {
    id: 'carrierTrack',
    name: 'Carrier Track',
    description: 'Carrier Track desc',
    datasetIds: ['carriers:dev'],
    resolvedDatasetsParams: [{
      id: '123abc',
      binary: true,
      fields: 'latlon,fishing,speed'
    }],
    resolvedViewParams: {
      type: Generators.Type.Track,
      color: '#ff00ff',
    },
    added: true,
    dirty: true,
    editing: true,
  }
]

const slice = createSlice({
  name: 'vessels',
  initialState,
  reducers: {
    // setDataviews: (state, action: PayloadAction<DataviewWorkspace[]>) => {
    //   action.payload.forEach((dataviewWorkspace: DataviewWorkspace) => {
    //     // inject workspaceDV id in config for convenience
    //     const newDataviewWorkspace = { ...dataviewWorkspace }
    //     if (newDataviewWorkspace.dataview) {
    //       newDataviewWorkspace.dataview.config.id = newDataviewWorkspace.id
    //       newDataviewWorkspace.dataview.config.datasetParamsId = dataviewWorkspace.datasetParams.id
    //     }
    //     state.push(newDataviewWorkspace)
    //   })
    // },
  },
})
// export const { setDataviews } = slice.actions
export default slice.reducer
export const selectDataviews = (state: RootState) => state.dataviews
