import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'store'
import type { Range } from 'types'

import type { ApiEvent } from '@globalfishingwatch/api-types'
import type {
  AnyGeneratorConfig,
  BackgroundGeneratorConfig,
  BasemapGeneratorConfig} from '@globalfishingwatch/layer-composer';
import {
  GeneratorType
} from '@globalfishingwatch/layer-composer'

export interface MapState {
  generatorsConfig: AnyGeneratorConfig[]
  highlightedTime?: Range
  highlightedEvent?: ApiEvent
  voyageTime?: Range
}

const initialState: MapState = {
  // This is the configuration eventually provided to GFW's Layer Composer in Map.tsx
  //generatorsConfig: DEFAULT_DATAVIEWS,
  generatorsConfig: [
    {
      id: 'background',
      type: GeneratorType.Background,
      color: '#ff0000',
    } as BackgroundGeneratorConfig,
    { id: 'satellite', type: GeneratorType.Basemap, visible: true } as BasemapGeneratorConfig,
  ],
}

export type UpdateGeneratorPayload = {
  id: string
  config: Partial<AnyGeneratorConfig>
}

// This slice is the part of the store that handles preparing generators configs, that then get passed
// to Layer Composer, which generates a style object that can be used by Mapbox GL (https://docs.mapbox.com/mapbox-gl-js/style-spec/)
export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    updateGenerator: (state, action: PayloadAction<UpdateGeneratorPayload>) => {
      const { id, config } = action.payload
      const index = state.generatorsConfig.findIndex((generator) => generator.id === id)
      if (index !== -1) {
        Object.assign(state.generatorsConfig[index], config)
      }
    },
    setHighlightedTime: (state, action: PayloadAction<Range>) => {
      state.highlightedTime = action.payload
    },
    setVoyageTime: (state, action: PayloadAction<Range | undefined>) => {
      state.voyageTime = action.payload
    },
    setHighlightedEvent: (state, action: PayloadAction<ApiEvent | undefined>) => {
      state.highlightedEvent = action.payload
    },
    disableHighlightedTime: (state) => {
      state.highlightedTime = undefined
    },
    disableVoyageTime: (state) => {
      state.voyageTime = undefined
    },
  } as Record<string, CaseReducer<MapState, PayloadAction<any>>>,
})

// createSlice generates for us actions that we can use to modify the store by calling dispatch, or using the useDispatch hook
export const {
  updateGenerator,
  setHighlightedTime,
  setVoyageTime,
  setHighlightedEvent,
  disableHighlightedTime,
  disableVoyageTime,
} = mapSlice.actions

// This is a simple selector that just picks a portion of the stor for consumption by either a component,
// or a more complex memoized selector. Memoized selectors and/or that need to access several slices,
// should go into a distiinct [feature].selectors.ts file (use createSelector from RTK)
export const selectGeneratorsConfig = (state: RootState) => state.map.generatorsConfig
export const selectHighlightedTime = (state: RootState) => state.map.highlightedTime
export const selectMapVoyageTime = (state: RootState) => state.map.voyageTime
export const selectHighlightedEvent = (state: RootState) => state.map.highlightedEvent

export default mapSlice.reducer
