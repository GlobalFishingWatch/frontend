import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { InteractionEvent, ExtendedFeatureVessel } from '@globalfishingwatch/react-hooks'

type MapState = {
  clicked: InteractionEvent | null
  hovered: InteractionEvent | null
}

const initialState: MapState = {
  clicked: null,
  hovered: null,
}

const slice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setClickedEvent: (state, action: PayloadAction<InteractionEvent | null>) => {
      if (action.payload === null) {
        state.clicked = null
        return
      }
      state.clicked = { ...action.payload }
    },
    setFeatureVessels: (
      state,
      action: PayloadAction<{ generatorId: string; vessels: ExtendedFeatureVessel[] }>
    ) => {
      if (!state.clicked || !state.clicked.features) return
      const clickedFeature = state.clicked.features.find(
        (f) => f.generatorId === action.payload.generatorId
      )
      if (!clickedFeature) return
      clickedFeature.vessels = action.payload.vessels
    },
  },
})

export const selectClickedEvent = (state: RootState) => state.map.clicked

export const { setClickedEvent, setFeatureVessels } = slice.actions
export default slice.reducer
