import { createSlice } from '@reduxjs/toolkit'
import { DataviewWorkspace } from '@globalfishingwatch/dataviews-client'
import { RootState } from 'store/store'

const initialState: DataviewWorkspace[] = [
  {
    id: '1'
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
