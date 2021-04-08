import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
// eslint-disable-next-line import/no-webpack-loader-syntax
import createAnalysisWorker from 'workerize-loader!./Analysis.worker'
import { MultiPolygon, Polygon } from 'geojson'
import { DateTime } from 'luxon'
import simplify from '@turf/simplify'
import bbox from '@turf/bbox'
import { getTimeSeries, getRealValue, getRealValues } from '@globalfishingwatch/fourwings-aggregate'
import {
  quantizeOffsetToDate,
  TEMPORALGRID_SOURCE_LAYER,
  TimeChunk,
  TimeChunks,
} from '@globalfishingwatch/layer-composer'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import useDebounce from '@globalfishingwatch/react-hooks/dist/use-debounce'
import { MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID } from '@globalfishingwatch/dataviews-client'
import { useGeneratorStyleMetadata } from 'features/map/map.hooks'
import {
  useActivityTemporalgridFeatures,
  useSourcesLoadingState,
  useActiveHeatmapAnimatedMetadatas,
  useFeatures,
} from 'features/map/map-features.hooks'
import { selectActiveActivityDataviews } from 'features/workspace/workspace.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import {
  selectActiveHeatmapAnimatedGeneratorConfigs,
  selectGeneratorsConfig,
} from 'features/map/map.selectors'
import * as AnalysisWorker from './Analysis.worker'
import AnalysisGraph, { GraphData, AnalysisGraphProps } from './AnalysisGraph'
import { selectAnalysisGeometry } from './analysis.slice'
import styles from './Analysis.module.css'

const { filterByPolygon } = createAnalysisWorker<typeof AnalysisWorker>()

function AnalysisGraphWrapper() {
  const generatorConfigs = useSelector(selectActiveHeatmapAnimatedGeneratorConfigs)
  //TODO collect metadata here, not just ids
  // TODO also pass metadata here
  const { sourcesFeatures, sourcesMetadata, haveAllSourcesLoaded } = useFeatures({
    generators: generatorConfigs,
    sourceLayer: TEMPORALGRID_SOURCE_LAYER,
  })

  const { start, end } = useTimerangeConnect()
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
            // console.log(minValues, minValues?.map(getRealValue))
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
            sublayers: sourceMetadata.sublayers.map((s: any) => s.legend || {}),
          }
        }
      )

      setSourceTimeseries(sourcesTimeseries)
      setGeneratingTimeseries(false)
    }

    if (sourcesFeatures && sourcesFeatures.some((features) => features.length > 0)) {
      console.log(sourcesFeatures, haveAllSourcesLoaded)
      // setGeneratingTimeseries(true)

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
  }, [simplifiedGeometry, sourcesMetadata, sourcesFeatures, haveAllSourcesLoaded])

  // const temporalGridDataviews = useSelector(selectActiveActivityDataviews)

  const debouncedSourceLoaded = useDebounce(haveAllSourcesLoaded, 600)

  // const simplifiedGeometry = useMemo(() => {
  //   if (!analysisAreaFeature) return null
  //   const simplifiedGeometry = simplify(analysisAreaFeature?.geometry as Polygon | MultiPolygon, {
  //     tolerance: 0.1,
  //   })
  //   // Doing this once to avoid recomputing inside turf booleanPointInPolygon for each cell
  //   // https://github.com/Turfjs/turf/blob/master/packages/turf-boolean-point-in-polygon/index.ts#L63
  //   simplifiedGeometry.bbox = bbox(simplifiedGeometry)
  //   return simplifiedGeometry
  // }, [analysisAreaFeature])

  // useEffect(() => {
  //   const updateTimeseries = async (
  //     allFeatures: GeoJSON.Feature<GeoJSON.Geometry>[],
  //     geometry: Polygon | MultiPolygon
  //   ) => {
  //     setGeneratingTimeseries(true)
  //     const filteredFeatures = (await filterByPolygon([allFeatures], geometry))[0]
  //     const valuesContained = getTimeSeries(
  //       (filteredFeatures.contained || []) as any,
  //       numSublayers,
  //       chunkQuantizeOffset
  //     ).map((frameValues) => {
  //       const { frame, ...rest } = frameValues
  //       return {
  //         values: Object.values(rest) as number[],
  //         date: quantizeOffsetToDate(frame, interval).toISOString(),
  //       }
  //     })

  //     const featuresContainedAndOverlapping = [
  //       ...(filteredFeatures.contained || []),
  //       ...(filteredFeatures.overlapping || []),
  //     ]
  //     const valuesContainedAndOverlapping = getTimeSeries(
  //       featuresContainedAndOverlapping as any,
  //       numSublayers,
  //       chunkQuantizeOffset
  //     ).map((frameValues) => {
  //       const { frame, ...rest } = frameValues
  //       return {
  //         values: Object.values(rest) as number[],
  //         date: quantizeOffsetToDate(frame, interval).toISOString(),
  //       }
  //     })

  //     const timeseries = valuesContainedAndOverlapping.map(({ values, date }) => {
  //       const minValues = valuesContained.find((overlap) => overlap.date === date)?.values
  //       return {
  //         date,
  //         min: minValues ? minValues.map(getRealValue) : new Array(values.length).fill(0),
  //         max: values.map(getRealValue),
  //       }
  //     })
  //     setTimeseries(timeseries)
  //     setGeneratingTimeseries(false)
  //   }

  //   if (cellFeatures && cellFeatures.length > 0) {
  //     setGeneratingTimeseries(true)
  //     const allFeatures = cellFeatures.map(({ properties, geometry }) => ({
  //       type: 'Feature' as any,
  //       properties,
  //       geometry,
  //     }))

  //     if (allFeatures?.length && simplifiedGeometry) {
  //       updateTimeseries(allFeatures, simplifiedGeometry)
  //     } else {
  //       setGeneratingTimeseries(false)
  //     }
  //   } else {
  //     setTimeseries(undefined)
  //   }
  //   // TODO will have to generate some kind of hash to rerun effect when layers + intervals change
  // }, [simplifiedGeometry, numSublayers, interval, cellFeatures, chunkQuantizeOffset])

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

  if (!debouncedSourceLoaded || generatingTimeseries) return <Spinner className={styles.spinner} />

  // const datasets = temporalGridDataviews?.map((dataview) => ({
  //   id: dataview.id,
  //   color: dataview.config?.color,
  // TODO do that in dv client
  //   unit: dataview.datasets?.[0].unit,
  // }))

  if (!sourcesTimeseriesFiltered?.length) {
    return <p className={styles.emptyDataPlaceholder}>No data available</p>
  }

  // TODO looks like it renders at each idle event, check why and ifx
  // console.log(sourcesTimeseriesFiltered)

  return (
    <Fragment>
      {sourcesTimeseriesFiltered.map((sourceTimeseriesFiltered, index) => {
        return <AnalysisGraph key={index} graphData={sourceTimeseriesFiltered} />
      })}
    </Fragment>
  )
}

export default AnalysisGraphWrapper
