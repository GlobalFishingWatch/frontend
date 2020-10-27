import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'

type Range = {
  start: string
  end: string
}

type TimebarSlice = {
  highlightedTime: Range | null
  staticTime: Range | null
}

const initialState: TimebarSlice = {
  highlightedTime: null,
  staticTime: null,
}

const slice = createSlice({
  name: 'timebar',
  initialState,
  reducers: {
    setHighlightedTime: (state, action: PayloadAction<Range>) => {
      state.highlightedTime = action.payload
    },
    disableHighlightedTime: (state) => {
      state.highlightedTime = null
    },
    setStaticTime: (state, action: PayloadAction<Range>) => {
      state.staticTime = action.payload
    },
  },
})

export const { setHighlightedTime, disableHighlightedTime, setStaticTime } = slice.actions
export default slice.reducer

export const selectHighlightedTime = (state: RootState) => state.timebar.highlightedTime
export const selectStaticTime = (state: RootState) => state.timebar.staticTime
