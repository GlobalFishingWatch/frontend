import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'

interface ContentState {
  userGuideOpen: boolean
  selectedSectionId: string | null
}

const initialState: ContentState = {
  userGuideOpen: false,
  selectedSectionId: null,
}

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setUserGuideOpen: (state, action: PayloadAction<boolean>) => {
      state.userGuideOpen = action.payload
      if (!action.payload) {
        state.selectedSectionId = null
      }
    },
    setSelectedSectionId: (state, action: PayloadAction<string | null>) => {
      state.selectedSectionId = action.payload
    },
    openUserGuideToSection: (state, action: PayloadAction<string>) => {
      state.userGuideOpen = true
      state.selectedSectionId = action.payload
    },
  },
})

export const { setUserGuideOpen, setSelectedSectionId, openUserGuideToSection } =
  contentSlice.actions

export const selectUserGuideOpen = (state: RootState) => state.content.userGuideOpen
export const selectSelectedSectionId = (state: RootState) => state.content.selectedSectionId

export default contentSlice.reducer
