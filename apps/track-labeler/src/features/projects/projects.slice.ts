import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit'

import type { Project } from '../../data/projects'
import type { RootState } from '../../store'
import type { ActionType } from '../../types'

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
