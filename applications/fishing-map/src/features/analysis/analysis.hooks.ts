import { useEffect, useMemo, useState } from 'react'
import { Polygon, MultiPolygon } from 'geojson'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import simplify from '@turf/simplify'
import bbox from '@turf/bbox'
// eslint-disable-next-line import/no-webpack-loader-syntax
import createAnalysisWorker from 'workerize-loader!./Analysis.worker'
import { TEMPORALGRID_SOURCE_LAYER } from '@globalfishingwatch/layer-composer/dist/generators'
import { quantizeOffsetToDate, TimeChunk } from '@globalfishingwatch/layer-composer'
import { getTimeSeries, getRealValues } from '@globalfishingwatch/fourwings-aggregate'
import { useFeatures } from 'features/map/map-features.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectActiveHeatmapAnimatedGeneratorConfigs } from 'features/map/map.selectors'
import { selectAnalysisGeometry } from './analysis.slice'
import { AnalysisGraphProps } from './AnalysisItemGraph'
import * as AnalysisWorker from './Analysis.worker'

const { filterByPolygon } = createAnalysisWorker<typeof AnalysisWorker>()

export const useFilteredTimeSeries = () => {
  const { start, end } = useTimerangeConnect()
  const generatorConfigs = useSelector(selectActiveHeatmapAnimatedGeneratorConfigs)
  const { sourcesFeatures, sourcesMetadata, haveAllSourcesLoaded } = useFeatures({
    generators: generatorConfigs,
    sourceLayer: TEMPORALGRID_SOURCE_LAYER,
  })
  const analysisAreaFeature = useSelector(selectAnalysisGeometry)
  const [generatingTimeseries, setGeneratingTimeseries] = useState(false)
  const [sourcesTimeseries, setSourceTimeseries] = useState<AnalysisGraphProps[] | undefined>()

  const simplifiedGeometry = useMemo(() => {
    if (!analysisAreaFeature) return null
    const simplifiedGeometry = simplify(analysisAreaFeature?.geometry as Polygon | MultiPolygon, {
      tolerance: 0.1,
    })
    // Doing this once to avoid recomputing inside turf booleanPointInPolygon for each cell
    // https://github.com/Turfjs/turf/blob/master/packages/turf-boolean-point-in-polygon/index.ts#L63
    simplifiedGeometry.bbox = bbox(simplifiedGeometry)
    return simplifiedGeometry
  }, [analysisAreaFeature])

  useEffect(() => {
    const updateTimeseries = async (
      allFeatures: GeoJSON.Feature<GeoJSON.Geometry>[][],
      geometry: Polygon | MultiPolygon
    ) => {
      setGeneratingTimeseries(true)
      const sourcesFilteredFeatures = await filterByPolygon(allFeatures, geometry)
      const sourcesTimeseries = sourcesFilteredFeatures.map(
        (sourceFilteredFeatures, sourceIndex) => {
          const sourceMetadata = sourcesMetadata[sourceIndex]
          const sourceNumSublayers = sourceMetadata.numSublayers
          const sourceActiveTimeChunk = sourceMetadata.timeChunks.chunks.find(
            (c: any) => c.active
          ) as TimeChunk
          const sourceQuantizeOffset = sourceActiveTimeChunk.quantizeOffset
          const sourceInterval = sourceMetadata.timeChunks.interval
          const valuesContained = getTimeSeries(
            (sourceFilteredFeatures.contained || []) as any,
            sourceNumSublayers,
            sourceQuantizeOffset,
            sourceMetadata.aggregationOperation
          ).map((frameValues) => {
            const { frame, ...rest } = frameValues
            return {
              values: Object.values(rest) as number[],
              date: quantizeOffsetToDate(frame, sourceInterval).toISOString(),
            }
          })

          const featuresContainedAndOverlapping = [
            ...(sourceFilteredFeatures.contained || []),
            ...(sourceFilteredFeatures.overlapping || []),
          ]
          const valuesContainedAndOverlapping = getTimeSeries(
            featuresContainedAndOverlapping as any,
            sourceNumSublayers,
            sourceQuantizeOffset,
            sourceMetadata.aggregationOperation
          ).map((frameValues) => {
            const { frame, ...rest } = frameValues
            return {
              values: Object.values(rest) as number[],
              date: quantizeOffsetToDate(frame, sourceInterval).toISOString(),
            }
          })

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
        }
      )

      setSourceTimeseries(sourcesTimeseries)
      setGeneratingTimeseries(false)
    }

    if (sourcesFeatures && sourcesFeatures.some((features) => features.length > 0)) {
      setGeneratingTimeseries(true)
      // Make features serializable for worker
      const allFeatures = sourcesFeatures.map((sourceFeatures) => {
        return sourceFeatures.map(({ properties, geometry }) => ({
          type: 'Feature' as any,
          properties,
          geometry,
        }))
      })

      if (simplifiedGeometry) {
        updateTimeseries(allFeatures, simplifiedGeometry)
      } else {
        setGeneratingTimeseries(false)
      }
    } else {
      setSourceTimeseries(undefined)
    }
  }, [simplifiedGeometry, sourcesMetadata, sourcesFeatures])
  const sourcesTimeseriesFiltered = useMemo(() => {
    return sourcesTimeseries?.map((sourceTimeseries) => {
      return {
        ...sourceTimeseries,
        timeseries: sourceTimeseries?.timeseries.filter((current: any) => {
          const currentDate = DateTime.fromISO(current.date)
          const startDate = DateTime.fromISO(start)
          const endDate = DateTime.fromISO(end)
          return currentDate >= startDate && currentDate < endDate
        }),
      }
    })
  }, [sourcesTimeseries, start, end])
  return { generatingTimeseries, haveAllSourcesLoaded, sourcesTimeseriesFiltered }
}
