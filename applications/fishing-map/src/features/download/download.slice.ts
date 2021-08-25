import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { RootState } from 'store'

export type DownloadArea = {
  areaId: string
  sourceId: string
  feature: TooltipEventFeature
}

type DownloadState = {
  area: DownloadArea | null
}

const initialState: DownloadState = {
  area: null,
}

const slice = createSlice({
  name: 'download',
  initialState,
  reducers: {
    setDownloadArea: (state, action: PayloadAction<DownloadArea | null>) => {
      if (action.payload === null) {
        state.area = null
        return
      }
      state.area = { ...action.payload }
    },
  },
})

export const selectDownloadArea = (state: RootState) => state.download.area
export const { setDownloadArea } = slice.actions
export default slice.reducer
