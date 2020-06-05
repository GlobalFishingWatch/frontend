import { createSlice } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import DataviewsClient, { Dataview } from '@globalfishingwatch/dataviews-client'
import { RootState } from 'store/store'

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
    viewParams: {
      id: 'background',
      type: Generators.Type.Background,
    },
    added: true,
    dirty: false,
    editing: false,
  },
  {
    id: 'basemap',
    name: 'basemap',
    description: 'basemap',
    viewParams: {
      id: 'landmass',
      type: Generators.Type.Basemap,
    },
    added: true,
    dirty: false,
    editing: false,
  },
  {
    id: 'carrierTrack',
    name: 'Carrier Track',
    description: 'Carrier Track desc',
    datasetIds: ['carriers:dev'],
    datasetsParams: [
      {
        id: '123abc',
        binary: true,
        fields: 'latlon,fishing,speed',
      },
    ],
    viewParams: {
      id: 'some_track',
      type: Generators.Type.Track,
      color: '#ff00ff',
    },
    added: true,
    dirty: true,
    editing: true,
  },
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

// Define a thunk that dispatches those action creators
// const fetchUsers = () => async dispatch => {
//   dispatch(usersLoading())
//   const response = await usersAPI.fetchAll()
//   dispatch(usersReceived(response.data))
// }
