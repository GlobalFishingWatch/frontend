import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'
import { Generators } from '@globalfishingwatch/layer-composer'
import DataviewsClient, { Dataview, Dataset } from '@globalfishingwatch/dataviews-client'
import { RootState } from 'store/store'

const initialState: {} = {}

const slice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    // setEditing: (state, action: PayloadAction<number>) => {
    // },
  },
})
// export const { setDataviews, setEditing, setMeta } = slice.actions
export default slice.reducer
// export const selectDataviews = (state: RootState) => state.dataviews.dataviews
