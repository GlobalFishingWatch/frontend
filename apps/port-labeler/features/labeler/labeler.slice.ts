import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'

export type ProjectSlice = {
  country: string | null
  hover: string | null
  selected: string[]
}

const initialState: ProjectSlice = {
  country: null,
  hover: null,
  selected: [],
}

const slice = createSlice({
  name: 'labeler',
  initialState,
  reducers: {
    setSelectedPoints: (state, action: PayloadAction<string[]>) => {
      state.selected = action.payload
    },
    setCountry: (state, action: PayloadAction<string>) => {
      state.country = action.payload
    },
    setHoverPoint: (state, action: PayloadAction<string | null>) => {
      state.hover = action.payload
    },
  },
})
export const { setSelectedPoints, setCountry, setHoverPoint } = slice.actions
export default slice.reducer

export const selectSelectedPoints = (state: RootState) => state.labeler.selected
export const selectCountry = (state: RootState) => state.labeler.country
export const selectHoverPoint = (state: RootState) => state.labeler.hover
