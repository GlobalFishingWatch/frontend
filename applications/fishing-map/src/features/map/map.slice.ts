import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store'
import GFWAPI from '@globalfishingwatch/api-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import {
  AnyGeneratorConfig,
  BackgroundGeneratorConfig,
  BasemapGeneratorConfig,
  // CartoPolygonsGeneratorConfig,
  HeatmapAnimatedGeneratorConfig,
} from '@globalfishingwatch/layer-composer/dist/generators/types'
import { selectMapZoomQuery, selectTimerange } from 'routes/routes.selectors'

export interface MapState {
  generatorsConfig: AnyGeneratorConfig[]
}

const initialState: MapState = {
  // This is the configuration eventually provided to GFW's Layer Composer in Map.tsx
  generatorsConfig: [
    {
      id: 'background',
      type: Generators.Type.Background,
      color: '#00265c',
    } as BackgroundGeneratorConfig,
    // {
    //   id: 'eez',
    //   type: Generators.Type.CartoPolygons,
    //   color: 'red',
    // } as CartoPolygonsGeneratorConfig,
    {
      id: 'basemap',
      type: Generators.Type.Basemap,
      basemap: Generators.BasemapType.Default,
    } as BasemapGeneratorConfig,
    {
      id: '1',
      type: Generators.Type.HeatmapAnimated,
      sublayers: [
        { id: '0', colorRamp: 'teal', datasets: ['fishing_v4'] },
        // { id: '1', colorRamp: 'magenta', datasets: ['dgg_fishing_caribe'] },
      ],
      combinationMode: 'compare',
      debug: false,
      debugLabels: false,
      geomType: 'gridded',
      tilesAPI: `${process.env.REACT_APP_API_GATEWAY}/v1/4wings`,
      interactive: true,
    } as HeatmapAnimatedGeneratorConfig,
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
  },
})

// createSlice generates for us actions that we can use to modify the store by calling dispatch, or using the useDispatch hook
export const { updateGenerator } = mapSlice.actions

// This is a simple selector that just picks a portion of the stor for consumption by either a component,
// or a more complex memoized selector. Memoized selectors and/or that need to access several slices,
// should go into a distiinct [feature].selectors.ts file (use createSelector from RTK)
export const selectGeneratorsConfig = (state: RootState) => state.map.generatorsConfig
export const selectGlobalGeneratorsConfig = createSelector(
  [selectMapZoomQuery, selectTimerange],
  (zoom, { start, end }) => ({
    zoom,
    start,
    end,
    token: GFWAPI.getToken(),
  })
)

export default mapSlice.reducer
