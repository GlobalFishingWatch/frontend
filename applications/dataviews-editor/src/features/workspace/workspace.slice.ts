import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store/store'

const initialState: { dataviews: { editorId: number }[] } = {
  dataviews: [
    {
      editorId: 0,
    },
    {
      editorId: 1,
    },
    {
      editorId: 2,
    },
  ],
}

const slice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    toggleDataview: (state, action: PayloadAction<{ editorId: number; added: boolean }>) => {
      const editorId = action.payload.editorId
      if (action.payload.added) {
        state.dataviews.push({
          editorId,
        })
      } else {
        state.dataviews.splice(
          state.dataviews.findIndex((d) => d.editorId === editorId),
          1
        )
      }
    },
  },
})
export const { toggleDataview } = slice.actions
export default slice.reducer
export const selectWorkspaceDataviews = (state: RootState) => state.workspace.dataviews
