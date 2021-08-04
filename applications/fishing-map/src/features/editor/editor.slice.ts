import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'store'

interface EditorState {
  active: boolean
}

const initialState: EditorState = {
  active: false,
}

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    toggleEditorMenu: (state) => {
      state.active = !state.active
    },
  },
})

export const { toggleEditorMenu } = editorSlice.actions

export const selectEditorActive = (state: RootState) => state.editor.active

export default editorSlice.reducer
