import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit'

import type { Dataview } from '@globalfishingwatch/api-types'

import type { RootState } from '../../store'

const initialState: { dataviews: any[] } = { dataviews: [] }
//TODO: Remove this file
const slice = createSlice({
  name: 'vessels',
  initialState,
  reducers: {
    setDataviews: (state, action: PayloadAction<Dataview[]>) => {
      state.dataviews = action.payload
    },
  },
})
export const { setDataviews } = slice.actions
export default slice.reducer
export const selectDataviews = (state: RootState) => state.dataviews.dataviews
