import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Resource } from '@globalfishingwatch/dataviews-client'
import { RootState } from 'store/store'

export interface EditorResource extends Resource {
  loaded?: boolean
}

const initialState: { resources: EditorResource[] } = {
  resources: [],
}

const slice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    addResources: (state, action: PayloadAction<Resource[]>) => {
      action.payload.forEach((resource) => {
        const existingResourceIndex = state.resources.findIndex(
          (r) => r.resolvedUrl === resource.resolvedUrl
        )
        if (existingResourceIndex === -1) {
          state.resources.push(resource)
        } else {
          state.resources = [
            ...state.resources.slice(0, existingResourceIndex),
            resource,
            ...state.resources.slice(existingResourceIndex + 1),
          ]
        }
      })
    },
    completeLoading: (state, action: PayloadAction<Resource>) => {
      const resource = state.resources.find(
        (resource) => resource.resolvedUrl === action.payload.resolvedUrl
      )
      if (resource) {
        resource.data = action.payload.data
        resource.loaded = true
      }
    },
  },
})
export const { addResources, completeLoading } = slice.actions
export default slice.reducer
export const selectResources = (state: RootState) => state.resources.resources
