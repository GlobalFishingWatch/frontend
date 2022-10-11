import { useCallback, useEffect } from 'react'
import { ckmeans } from 'simple-statistics'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import {
  DataviewFeature,
  areDataviewsFeatureLoaded,
  useMapDataviewFeatures,
} from 'features/map/map-sources.hooks'
import { useMapBounds } from 'features/map/map-viewport.hooks'

export const useEventsDynamicRamp = (dataview: UrlDataviewInstance) => {
  const { bounds } = useMapBounds()
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
        const ck = ckmeans(data, steps).map(([clusterFirst]) => parseFloat(clusterFirst.toFixed(3)))
        let breaks = []
        ck.forEach((k, i) => {
          if (i > 1) {
            const cleanBreak = k === 0 || k <= breaks?.[i - 1] ? breaks[i - 1] + 0.01 : k
            breaks.push(cleanBreak)
          } else {
            breaks.push(k)
          }
        })
        upsertDataviewInstance({
          id: dataviewsId[0],
          config: { breaks },
        })
      }
    },
    [upsertDataviewInstance]
  )

  useEffect(() => {
    if (sourcesLoaded) {
      updateBreaksByViewportValues(dataviewFeatures[0], bounds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourcesLoaded])
}
