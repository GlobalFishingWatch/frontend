import { useCallback, useEffect } from 'react'
import { ckmeans } from 'simple-statistics'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { MAX_ZOOM_TO_CLUSTER_POINTS } from '@globalfishingwatch/layer-composer'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import {
  DataviewFeature,
  areDataviewsFeatureLoaded,
  useMapDataviewFeatures,
} from 'features/map/map-sources.hooks'
import { useViewStateAtom, useMapBounds } from 'features/map/map-viewport.hooks'

export const useEventsDynamicRamp = (dataview: UrlDataviewInstance) => {
  const { bounds } = useMapBounds()
  const { viewState } = useViewStateAtom()
  const dataviewFeatures = useMapDataviewFeatures(dataview)
  const sourcesLoaded = areDataviewsFeatureLoaded(dataviewFeatures)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const updateBreaksByViewportValues = useCallback(
    ({ features, dataviewsId } = {} as DataviewFeature, bounds: MiniglobeBounds) => {
      const filteredFeatures = filterFeaturesByBounds(features, bounds)
      if (filteredFeatures?.length > 0) {
        const data = filteredFeatures.map((feature) => feature.properties?.count)
        const steps = Math.min(data.length, 3)
        // using ckmeans as jenks
        const ck = ckmeans(data, steps).map(([clusterFirst]) => parseInt(clusterFirst))
        const max = data.reduce((acc, data) => (data > acc ? data : acc), 0)
        upsertDataviewInstance({
          id: dataviewsId[0],
          config: {
            breaks: [ck[0], ck[0] === ck[1] ? ck[1] + 1 : ck[1], ck[1] === max ? max + 1 : max],
          },
        })
      }
    },
    [upsertDataviewInstance]
  )

  const roundZoom = Math.floor(viewState.zoom)
  useEffect(() => {
    const maxZoomCluster = dataview.config?.maxZoomCluster || MAX_ZOOM_TO_CLUSTER_POINTS
    if (sourcesLoaded && roundZoom < maxZoomCluster) {
      updateBreaksByViewportValues(dataviewFeatures[0], bounds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourcesLoaded, roundZoom])
}
