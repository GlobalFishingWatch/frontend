import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import bbox from '@turf/bbox'
import union from '@turf/union'
import { Bbox } from '@globalfishingwatch/data-transforms'
import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import { useMapLayerFeatures } from 'features/map/map-sources.hooks'
import { useContexLayers } from 'features/layers/layers.hooks'

export const useAnalysisArea = () => {
  const {
    query: { areaId, layerId },
  } = useRouter()
  const contextLayers = useContexLayers()
  const contextLayer = contextLayers.find((l) => l.id === layerId)
  const contextLayerWithFilter = useMemo(() => {
    return [{ ...contextLayer, filter: ['==', 'id', areaId as string] }]
  }, [areaId, contextLayer])
  const contextFeatures = useMapLayerFeatures(contextLayerWithFilter)

  const area = useMemo(() => {
    return contextFeatures?.[0]?.features?.reduce<any>((acc, next) => {
      return union(acc, next as any)
    }, contextFeatures?.[0]?.features[0])
  }, [contextFeatures])

  const areaName = area?.properties?.[contextLayer?.dataset?.configuration?.polygonId]
  const areaGeometry = area?.geometry
  const fitMapBounds = useMapFitBounds()

  const areaBounds = useMemo(() => {
    return areaGeometry ? (bbox(areaGeometry) as Bbox) : null
  }, [areaGeometry])

  // const { updateFeatureState, cleanFeatureState } = useFeatureState(map)

  // const setHighlightedArea = useCallback(() => {
  //   cleanFeatureState('highlight')
  //   const featureState = {
  //     source: sourceId,
  //     sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
  //     id: areaId,
  //   }
  //   updateFeatureState([featureState], 'highlight')
  // }, [areaId, cleanFeatureState, sourceId, updateFeatureState])

  useEffect(() => {
    if (areaBounds) {
      fitMapBounds(areaBounds, { padding: 30 })
      // setHighlightedArea()
    }
  }, [areaBounds, fitMapBounds])

  return { areaName, areaFeature: area }
}
