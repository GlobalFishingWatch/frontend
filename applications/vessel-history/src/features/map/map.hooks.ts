import { useSelector, useDispatch } from 'react-redux'
import {
  selectGeneratorsConfig,
  updateGenerator,
  UpdateGeneratorPayload,
  selectGlobalGeneratorsConfig,
} from './map.slice'

// This is a convenience hook that returns at the same time the portions of the store we interested in
// as well as the functions we need to update the same portions
export const useGeneratorsConnect = () => {
  const dispatch = useDispatch()
  return {
    globalConfig: useSelector(selectGlobalGeneratorsConfig),
    generatorsConfig: useSelector(selectGeneratorsConfig),
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
