import { useSelector, useDispatch } from 'react-redux'
import { selectDefaultMapGeneratorsConfig } from './map.selectors'
import { updateGenerator, UpdateGeneratorPayload, selectGlobalGeneratorsConfig } from './map.slice'

// >>> To take into account when implementing useViewport <<<
// j8seangel: This always was an 🤯 let's talk about the latest working solution I found
// using an atom (https://github.com/GlobalFishingWatch/frontend/blob/master/applications/fishing-map/src/features/map/map-viewport.hooks.ts#L26)

// This is a convenience hook that returns at the same time the portions of the store we interested in
// as well as the functions we need to update the same portions
export const useGeneratorsConnect = () => {
  const dispatch = useDispatch()
  return {
    globalConfig: useSelector(selectGlobalGeneratorsConfig),
    generatorsConfig: useSelector(selectDefaultMapGeneratorsConfig),
    updateGenerator: (payload: UpdateGeneratorPayload) => dispatch(updateGenerator(payload)),
  }
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
