import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { InteractionEvent } from '@globalfishingwatch/react-hooks'

type MapFeaturesState = {
  clicked: InteractionEvent | null
  hovered: InteractionEvent | null
}

const initialState: MapFeaturesState = {
  clicked: null,
  hovered: null,
}

const slice = createSlice({
  name: 'mapFeatures',
  initialState,
  reducers: {
    setClickedEvent: (state, action: PayloadAction<InteractionEvent | null>) => {
      state.clicked = action.payload
    },
  },
})

export const selectClickedFeatures = (state: RootState) => state.mapFeatures.clicked

export const { setClickedEvent } = slice.actions
export default slice.reducer
