import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { Dispatch } from 'react'
import { WorkspaceDataview } from '@globalfishingwatch/dataviews-client'
import { RootState } from 'store/store'

const initialState: { dataviews: WorkspaceDataview[] } = {
  dataviews: [
    // {
    //   id: 0,
    // },
    {
      id: 1,
    },
    {
      id: 2,
    },
  ],
}

const slice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    toggleDataview: (state, action: PayloadAction<{ id: number; added: boolean }>) => {
      const id = action.payload.id
      if (action.payload.added) {
        state.dataviews.push({
          id,
        })
      } else {
        state.dataviews.splice(
          state.dataviews.findIndex((d) => d.id === id),
          1
        )
      }
    },
  },
})
export const { toggleDataview } = slice.actions
export default slice.reducer
export const selectWorkspaceDataviews = (state: RootState) => state.workspace.dataviews
