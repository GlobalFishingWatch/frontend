import { useSelector, useDispatch } from 'react-redux'
import GFWAPI from '@globalfishingwatch/api-client'
import { ExtendedFeature, InteractionEvent } from '@globalfishingwatch/react-hooks'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import {
  selectTemporalgridDataviews,
  selectWorkspaceDataviews,
} from '../workspace/workspace.selectors'
import { setClickedEvent, selectClickedEvent } from './map-features.slice'

export const useClickedEventConnect = () => {
  const dispatch = useDispatch()
  const clickedEvent = useSelector(selectClickedEvent)
  const dataviews = useSelector(selectWorkspaceDataviews)
  const temporalgridDataviews = useSelector(selectTemporalgridDataviews)
  const dispatchClickedEvent = (event: InteractionEvent | null) => {
    if (!event || !event.features) return
    // TODO should work for multiple features
    const feature: ExtendedFeature = event.features[0]
    if (!dataviews || !feature || !feature.temporalgrid) return

    // TODO We assume here that temporalgrid dataviews appear in the same order as sublayers are set in the generator, ie indices will match feature.temporalgrid.sublayerIndex
    const dataview = temporalgridDataviews[feature.temporalgrid.sublayerIndex]
    // TODO How to get the proper id? Should be fishing_v4
    const DATASET_ID = 'dgg_fishing_galapagos'
    const dataset = dataview.datasets?.find((dataset) => dataset.id === DATASET_ID)
    if (!dataset) return []
    const datasetConfig = {
      datasetId: DATASET_ID,
      params: [
        { id: 'z', value: feature.tile.z },
        { id: 'x', value: feature.tile.x },
        { id: 'y', value: feature.tile.y },
        { id: 'rows', value: feature.temporalgrid.row },
        { id: 'cols', value: feature.temporalgrid.col },
      ],
      endpoint: '4wings-interaction',
    }
    const url = resolveEndpoint(dataset, datasetConfig)
    if (url) {
      GFWAPI.fetch(url).then((vessels) => {
        console.log(vessels)
      })
    }

    dispatch(setClickedEvent(event))
  }
  return { clickedEvent, dispatchClickedEvent }
}
