import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ActionType } from 'types'
import { RootState } from 'store'
import { Project } from 'data/projects'

export type SelectedTrackType = {
  start?: number | null
  startLatitude?: number | null
  startLongitude?: number | null
  end?: number | null
  endLatitude?: number | null
  endLongitude?: number | null
  action?: ActionType
}

export type ProjectSlice = {
  project: Project | null
}

const initialState: ProjectSlice = {
  project: null,
}

const slice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProject: (state, action: PayloadAction<Project>) => {
      state.project = action.payload
    },
  },
})
export const { setProject } = slice.actions
export default slice.reducer

export const selectedProject = (state: RootState) => state.project.project
