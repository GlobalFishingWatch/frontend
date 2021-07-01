import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Feature, Polygon, MultiPolygon } from 'geojson'
import union from '@turf/union'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import simplify from '@turf/simplify'
import bbox from '@turf/bbox'
// eslint-disable-next-line import/no-webpack-loader-syntax
import createAnalysisWorker from 'workerize-loader!./Analysis.worker'
import { quantizeOffsetToDate, TEMPORALGRID_SOURCE_LAYER } from '@globalfishingwatch/layer-composer'
import { getTimeSeries, getRealValues } from '@globalfishingwatch/fourwings-aggregate'
import {
  TimeChunk,
  TimeChunks,
} from '@globalfishingwatch/layer-composer/dist/generators/heatmap/util/time-chunks'
import type { Map } from '@globalfishingwatch/mapbox-gl'
import { MapboxEvent } from '@globalfishingwatch/mapbox-gl'
import { useFeatureState } from '@globalfishingwatch/react-hooks/dist/use-map-interaction'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer/dist/generators'
import { Bbox } from 'types'
import { useLocationConnect } from 'routes/routes.hook'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { selectAnalysisQuery } from 'features/app/app.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import useMapInstance from 'features/map/map-context.hooks'
import { useSourceInStyle } from 'features/map/map-features.hooks'
import { selectAnalysisGeometry, setAnalysisGeometry } from './analysis.slice'
import { AnalysisGraphProps } from './AnalysisItemGraph'
import * as AnalysisWorker from './Analysis.worker'

const { filterByPolygon } = createAnalysisWorker<typeof AnalysisWorker>()

type LayerWithFeatures = {
  id: string
  features: GeoJSON.Feature<GeoJSON.Geometry>[]
  metadata: any
}

export const useFilteredTimeSeries = () => {
  const map = useMapInstance()
  const analysisAreaGeometry = useSelector(selectAnalysisGeometry)
  const [timeseries, setTimeseries] = useState<AnalysisGraphProps[] | undefined>()

  const simplifiedGeometry = useMemo(() => {
    if (!analysisAreaGeometry) return null
    const simplifiedGeometry = simplify(analysisAreaGeometry?.geometry as Polygon | MultiPolygon, {
      tolerance: 0.1,
    })
    // Doing this once to avoid recomputing inside turf booleanPointInPolygon for each cell
    // https://github.com/Turfjs/turf/blob/master/packages/turf-boolean-point-in-polygon/index.ts#L63
    simplifiedGeometry.bbox = bbox(simplifiedGeometry)
    return simplifiedGeometry
  }, [analysisAreaGeometry])

  const computeTimeseries = useCallback(
    (layersWithFeatures: LayerWithFeatures[], geometry: Polygon | MultiPolygon) => {
      const getTimeseries = async (
        layersWithFeatures: LayerWithFeatures[],
        geometry: Polygon | MultiPolygon
      ) => {
        const filteredFeatures = await filterByPolygon(
          layersWithFeatures.map((l) => l.features),
          geometry
        )
        const timeseries = filteredFeatures.map((filteredFeatures, sourceIndex) => {
          const sourceMetadata = layersWithFeatures[sourceIndex].metadata
          const sourceNumSublayers = sourceMetadata.numSublayers
          // TODO handle multiple timechunks
          const sourceActiveTimeChunk = sourceMetadata.timeChunks.chunks.find(
            (c: any) => c.active
          ) as TimeChunk
          const sourceQuantizeOffset = sourceActiveTimeChunk.quantizeOffset
          const sourceInterval = sourceMetadata.timeChunks.interval
          const { values: valuesContainedRaw } = getTimeSeries(
            (filteredFeatures.contained || []) as any,
            sourceNumSublayers,
            sourceQuantizeOffset,
            sourceMetadata.aggregationOperation
          )

          const valuesContained = valuesContainedRaw.map((frameValues) => {
            const { frame, ...rest } = frameValues
            return {
              values: Object.values(rest) as number[],
              date: quantizeOffsetToDate(frame, sourceInterval).toISOString(),
            }
          })

          const featuresContainedAndOverlapping = [
            ...(filteredFeatures.contained || []),
            ...(filteredFeatures.overlapping || []),
          ]
          const { values: valuesContainedAndOverlappingRaw } = getTimeSeries(
            featuresContainedAndOverlapping as any,
            sourceNumSublayers,
            sourceQuantizeOffset,
            sourceMetadata.aggregationOperation
          )

          const valuesContainedAndOverlapping = valuesContainedAndOverlappingRaw.map(
            (frameValues) => {
              const { frame, ...rest } = frameValues
              return {
                values: Object.values(rest) as number[],
                date: quantizeOffsetToDate(frame, sourceInterval).toISOString(),
              }
            }
          )

          const timeseries = valuesContainedAndOverlapping.map(({ values, date }) => {
            const minValues = valuesContained.find((overlap) => overlap.date === date)?.values
            return {
              date,
              // TODO take into account multiplier when calling getRealValue
              min: minValues ? getRealValues(minValues) : new Array(values.length).fill(0),
              max: getRealValues(values),
            }
          })
          return {
            timeseries,
            interval: sourceInterval,
            sublayers: sourceMetadata.sublayers,
          }
        })
        setTimeseries(timeseries)
      }
      // Make features serializable for worker
      const serializedLayerWithFeatures = layersWithFeatures.map((layerWithFeatures) => {
        return {
          ...layerWithFeatures,
          features: layerWithFeatures.features.map(({ properties, geometry }) => ({
            type: 'Feature' as any,
            properties,
            geometry,
          })),
        }
      })
      getTimeseries(serializedLayerWithFeatures, geometry)
    },
    []
  )

  const attachedListener = useRef<boolean>(false)
  const { areaId } = useSelector(selectAnalysisQuery)

  useEffect(() => {
    // Used to re-attach the idle listener on area change
    setTimeseries(undefined)
    attachedListener.current = false
  }, [areaId])

  useEffect(() => {
    if (!map || attachedListener.current || !simplifiedGeometry) return

    attachedListener.current = true

    const onMapIdle = (e: MapboxEvent) => {
      const style = (e.target as any).style.stylesheet
      const activityLayersMeta = style.metadata.generatorsMetadata
      const activityLayersWithFeatures = Object.entries(activityLayersMeta).map(
        ([dataviewId, metadata]) => {
          const chunks = (metadata as any).timeChunks as TimeChunks
          const allChunksFeatures = chunks.chunks.flatMap((chunk: TimeChunk) => {
            const sourceFeatures = map.querySourceFeatures(chunk.sourceId as string, {
              sourceLayer: TEMPORALGRID_SOURCE_LAYER,
            })
            return sourceFeatures
          })
          return {
            id: dataviewId,
            features: allChunksFeatures,
            metadata,
          }
        }
      )
      if (activityLayersWithFeatures.length) {
        computeTimeseries(activityLayersWithFeatures, simplifiedGeometry as MultiPolygon)
        map.off('idle', onMapIdle)
      }
    }

    map.on('idle', onMapIdle)
  }, [map, computeTimeseries, simplifiedGeometry])

  const { start, end } = useTimerangeConnect()

  const layersTimeseriesFiltered = useMemo(() => {
    if (start && end) {
      return timeseries?.map((layerTimeseries) => {
        return {
          ...layerTimeseries,
          timeseries: layerTimeseries?.timeseries.filter((current: any) => {
            const currentDate = DateTime.fromISO(current.date)
            const startDate = DateTime.fromISO(start)
            const endDate = DateTime.fromISO(end)
            return currentDate >= startDate && currentDate < endDate
          }),
        }
      })
    }
  }, [timeseries, start, end])

  return layersTimeseriesFiltered
}

const getContextAreaGeometry = (contextAreaFeatures?: mapboxgl.MapboxGeoJSONFeature[]) => {
  const contextAreaGeometry = contextAreaFeatures?.reduce((acc, { geometry, properties }) => {
    const featureGeometry: Feature<Polygon> = {
      type: 'Feature',
      geometry: geometry as Polygon,
      properties,
    }
    if (!acc?.type) return featureGeometry
    return union(acc, featureGeometry, { properties }) as Feature<Polygon>
  }, {} as Feature<Polygon>)
  return contextAreaGeometry
}

export const useAnalysisGeometry = () => {
  const map = useMapInstance()
  const dispatch = useDispatch()
  const fitMapBounds = useMapFitBounds()
  const attachedListener = useRef<boolean>(false)
  const { dispatchQueryParams } = useLocationConnect()
  const { areaId, sourceId } = useSelector(selectAnalysisQuery)
  const { updateFeatureState, cleanFeatureState } = useFeatureState(map)
  const [loaded, setLoaded] = useState(false)
  const sourceLoaded = useSourceInStyle(sourceId)

  const getContextAreaFeatures = useCallback(
    (map: Map) => {
      const filter = ['==', 'gfw_id', parseInt(areaId)]
      const contextAreaFeatures = map.querySourceFeatures(sourceId, {
        sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
        filter,
      })
      return contextAreaFeatures
    },
    [areaId, sourceId]
  )

  const setHighlightedArea = useCallback(() => {
    cleanFeatureState('highlight')
    const featureState = {
      source: sourceId,
      sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
      id: areaId,
    }
    updateFeatureState([featureState], 'highlight')
  }, [areaId, cleanFeatureState, sourceId, updateFeatureState])

  const setAnalysisBounds = useCallback(
    (bounds: Bbox) => {
      dispatchQueryParams({ analysis: { areaId, bounds, sourceId } })
    },
    [areaId, sourceId, dispatchQueryParams]
  )

  useEffect(() => {
    // Used to re-attach the idle listener on area change
    attachedListener.current = false
    setLoaded(false)
  }, [areaId])

  useEffect(() => {
    if (!map || attachedListener.current || !sourceLoaded) return

    attachedListener.current = true

    const onMapIdle = (e: MapboxEvent) => {
      const contextAreaFeatures = getContextAreaFeatures(map)
      const contextAreaGeometry = getContextAreaGeometry(contextAreaFeatures)

      if (contextAreaGeometry && contextAreaGeometry.type === 'Feature') {
        const { name, value, id } = contextAreaGeometry.properties || {}
        const areaName: string = name || id || value
        const bounds = bbox(contextAreaGeometry) as Bbox
        if (areaName && bounds) {
          setAnalysisBounds(bounds)
          fitMapBounds(bounds, { padding: 10 })
          dispatch(
            setAnalysisGeometry({
              geometry: contextAreaGeometry,
              name: areaName,
              bounds,
            })
          )
          setHighlightedArea()
        } else {
          console.warn('No area name or bounds')
        }
        setLoaded(true)
      }
      map.off('idle', onMapIdle)
    }
    if (map) {
      map.on('idle', onMapIdle)
    }
  }, [
    map,
    areaId,
    sourceLoaded,
    getContextAreaFeatures,
    setAnalysisBounds,
    fitMapBounds,
    dispatch,
    setHighlightedArea,
  ])

  return loaded
}
