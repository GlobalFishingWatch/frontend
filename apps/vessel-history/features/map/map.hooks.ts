import { useDispatch,useSelector } from 'react-redux'

import type {
  StyleTransformation} from '@globalfishingwatch/layer-composer';
import {
  getInteractiveLayerIds,
  sort,
} from '@globalfishingwatch/layer-composer'

import { LAST_POSITION_LAYERS_PREFIX } from 'data/config'

import { selectDefaultMapGeneratorsConfig, selectGlobalGeneratorsConfig } from './map.selectors'
import type { UpdateGeneratorPayload } from './map.slice';
import { updateGenerator } from './map.slice'

// >>> To take into account when implementing useViewport <<<
// j8seangel: This always was an 🤯 let's talk about the latest working solution I found
// using an atom (https://github.com/GlobalFishingWatch/frontend/blob/master/apps/fishing-map/src/features/map/map-viewport.hooks.ts#L26)

const defaultTransformations: StyleTransformation[] = [sort, getInteractiveLayerIds]
const styleTransformations: StyleTransformation[] = [
  ...defaultTransformations,
  (style) => ({
    ...style,
    sprite:
      'https://raw.githubusercontent.com/GlobalFishingWatch/map-gl-sprites/master/out/vessel-viewer',
  }),

  // Move last position layer to top
  (style) => ({
    ...style,
    layers: [
      ...(style.layers?.filter((layer) => !layer.id.startsWith(LAST_POSITION_LAYERS_PREFIX)) ?? []),
      ...(style.layers?.filter((layer) => layer.id.startsWith(LAST_POSITION_LAYERS_PREFIX)) ?? []),
    ],
  }),
]

// This is a convenience hook that returns at the same time the portions of the store we interested in
// as well as the functions we need to update the same portions
export const useGeneratorsConnect = () => {
  const dispatch = useDispatch()
  const generator = {
    globalConfig: useSelector(selectGlobalGeneratorsConfig),
    generatorsConfig: useSelector(selectDefaultMapGeneratorsConfig),
    updateGenerator: (payload: UpdateGeneratorPayload) => dispatch(updateGenerator(payload)),
    styleTransformations,
  }

  return generator
}
export type LatLon = {
  latitude: number
  longitude: number
}
export interface Viewport extends LatLon {
  latitude: number
  longitude: number
  zoom: number
}
