import { useCallback, useEffect } from 'react'
import { ckmeans, sample, mean, standardDeviation, min, max } from 'simple-statistics'
import { useSelector } from 'react-redux'
import { Feature, GeoJsonProperties, Geometry } from 'geojson'
import {
  COLOR_RAMP_DEFAULT_NUM_STEPS,
  GeneratorType,
  HEATMAP_STATIC_PROPERTY_ID,
  HeatmapLayerMeta,
} from '@globalfishingwatch/layer-composer'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import { aggregateFeatures, ChunkFeature } from '@globalfishingwatch/features-aggregate'
import { GeoJSONFeature } from '@globalfishingwatch/fourwings-aggregate'
import { DataviewConfig } from '@globalfishingwatch/api-types'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectActiveHeatmapEnvironmentalDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import {
  DataviewFeature,
  areDataviewsFeatureLoaded,
  useMapDataviewFeatures,
} from 'features/map/map-sources.hooks'
import { useMapBounds } from 'features/map/map-viewport.hooks'
import { filterByPolygon } from 'features/reports/reports-geo.utils'
import { selectReportArea } from 'features/reports/reports.selectors'
import { AreaGeometry } from 'features/areas/areas.slice'

const filterVisibleValues = (
  rawData: number[],
  config: DataviewConfig<GeneratorType> | undefined
) => {
  if (!config?.minVisibleValue && !config?.maxVisibleValue) return rawData
  return rawData.filter((d) => {
    const matchesMin = config?.minVisibleValue !== undefined ? d >= config?.minVisibleValue : true
    const matchesMax = config?.maxVisibleValue !== undefined ? d <= config?.maxVisibleValue : true
    return matchesMin && matchesMax
  })
}

const getValues = (
  features: Feature<Geometry, GeoJsonProperties>[],
  metadata: HeatmapLayerMeta | undefined
) => {
  return metadata?.static
    ? features.map((f) => f.properties?.[HEATMAP_STATIC_PROPERTY_ID] as number)
    : aggregateFeatures(
        features as GeoJSONFeature<Record<string, any>>[],
        metadata as HeatmapLayerMeta
      )
}

export const useEnvironmentalBreaksUpdate = () => {
  const dataviews = useSelector(selectActiveHeatmapEnvironmentalDataviews)
  const area = useSelector(selectReportArea)
  const { bounds } = useMapBounds()
  const dataviewFeatures = useMapDataviewFeatures(dataviews)
  const sourcesLoaded = areDataviewsFeatureLoaded(dataviewFeatures)
  const layersFilterHash = dataviews
    .flatMap(({ config }) => `${config?.minVisibleValue}-${config?.maxVisibleValue}`)
    .join(',')
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const hasDataviewStats = dataviews.every((d) => d.config?.stats)

  const updateBreaksByViewportValues = useCallback(
    (dataviewFeatures: DataviewFeature[], bounds: MiniglobeBounds) => {
      const dataviewInstances = dataviewFeatures?.flatMap(
        ({ features, chunksFeatures, dataviewsId, metadata }) => {
          const resolvedFeatures = chunksFeatures?.[0]?.features || features || ({} as ChunkFeature)
          if (resolvedFeatures && resolvedFeatures.length) {
            const config = dataviews.find(({ id }) => dataviewsId.includes(id))?.config
            const filteredFeatures = filterFeaturesByBounds(resolvedFeatures, bounds)
            const rawData = getValues(filteredFeatures, metadata)
            const data = filterVisibleValues(rawData, config)
            if (data && data.length) {
              const dataSampled = data.length > 1000 ? sample(data, 1000, Math.random) : data
              // filter data to 2 standard deviations from mean to remove outliers
              const meanValue = mean(dataSampled)
              const standardDeviationValue = standardDeviation(dataSampled)
              const upperCut = meanValue + standardDeviationValue * 2
              const lowerCut = meanValue - standardDeviationValue * 2
              const dataFiltered = dataSampled.filter((a) => a >= lowerCut && a <= upperCut)
              const steps = Math.min(dataFiltered.length, COLOR_RAMP_DEFAULT_NUM_STEPS - 1)
              // using ckmeans as jenks
              const ck = ckmeans(dataFiltered, steps).map(([clusterFirst]) =>
                parseFloat(clusterFirst.toFixed(3))
              )
              // Needed to ensure there is the correct num of steps in areas where
              // ck returns less than COLOR_RAMP_DEFAULT_NUM_STEPS
              const ckWithAllSteps = [...new Array(COLOR_RAMP_DEFAULT_NUM_STEPS)].map((_, i) => {
                return ck[i] || 0
              })
              let cleanBreaks = [] as number[]
              ckWithAllSteps.forEach((k, i) => {
                if (i >= 1) {
                  const cleanBreak =
                    k === 0 || k <= cleanBreaks?.[i - 1] ? cleanBreaks[i - 1] + 0.01 : k
                  cleanBreaks.push(cleanBreak)
                } else {
                  cleanBreaks.push(k)
                }
              })
              return {
                id: dataviewsId[0],
                config: {
                  breaks: cleanBreaks,
                },
              }
            }
            return []
          }
          return []
        }
      )
      if (dataviewInstances) {
        upsertDataviewInstance(dataviewInstances)
      }
    },
    [dataviews, upsertDataviewInstance]
  )

  const updateStatsByArea = useCallback(
    (dataviewFeatures: DataviewFeature[], geometry: AreaGeometry) => {
      const dataviewInstances = dataviewFeatures?.flatMap(
        ({ features, chunksFeatures, dataviewsId, metadata }) => {
          const resolvedFeatures = chunksFeatures?.[0]?.features || features || ({} as ChunkFeature)
          if (resolvedFeatures && resolvedFeatures.length && geometry) {
            const config = dataviews.find(({ id }) => dataviewsId.includes(id))?.config
            const featuresInReportArea = filterByPolygon([resolvedFeatures], geometry, 'point')[0]
            const allFeaturesInReportArea = [
              ...(featuresInReportArea?.contained || []),
              ...(featuresInReportArea?.overlapping || []),
            ]
            const values = getValues(allFeaturesInReportArea, metadata)
            const visibleValues = filterVisibleValues(values, config)
            if (!visibleValues.length) return []
            const areaStats = {
              min: min(visibleValues),
              mean: mean(visibleValues),
              max: max(visibleValues),
            }
            return {
              id: dataviewsId[0],
              config: {
                stats: areaStats,
              },
            }
          }
          return []
        }
      )
      if (dataviewInstances) {
        upsertDataviewInstance(dataviewInstances)
      }
    },
    [dataviews, upsertDataviewInstance]
  )

  useEffect(() => {
    if (sourcesLoaded) {
      updateBreaksByViewportValues(dataviewFeatures, bounds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourcesLoaded, layersFilterHash])

  useEffect(() => {
    if (hasDataviewStats) {
      upsertDataviewInstance(dataviews.map(({ id }) => ({ id, config: { stats: undefined } })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area?.geometry])

  useEffect(() => {
    if (sourcesLoaded && area?.geometry && !hasDataviewStats) {
      updateStatsByArea(dataviewFeatures, area.geometry)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area?.geometry, sourcesLoaded, layersFilterHash, hasDataviewStats])
}
