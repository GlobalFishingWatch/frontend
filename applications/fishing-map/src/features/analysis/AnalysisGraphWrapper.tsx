import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
// eslint-disable-next-line import/no-webpack-loader-syntax
import createAnalysisWorker from 'workerize-loader!./Analysis.worker'
import { Feature, Geometry } from 'geojson'
import { DateTime } from 'luxon'
import { getTimeSeries, VALUE_MULTIPLIER } from '@globalfishingwatch/fourwings-aggregate'
import { quantizeOffsetToDate, TimeChunk, TimeChunks } from '@globalfishingwatch/layer-composer'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { useMapStyle } from 'features/map/map.hooks'
import { useMapTemporalgridFeatures } from 'features/map/map-features.hooks'
import { selectTemporalgridDataviews } from 'features/workspace/workspace.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import * as AnalysisWorker from './Analysis.worker'
import AnalysisGraph, { GraphData } from './AnalysisGraph'
import { selectAnalysisGeometry } from './analysis.slice'
import styles from './Analysis.module.css'

const { filterByPolygon } = createAnalysisWorker<typeof AnalysisWorker>()

function AnalysisGraphWrapper() {
  const temporalGridDataviews = useSelector(selectTemporalgridDataviews)
  const { start, end } = useTimerangeConnect()
  const analysisAreaFeature = useSelector(selectAnalysisGeometry)
  const [generatingTimeseries, setGeneratingTimeseries] = useState(false)
  const [timeseries, setTimeseries] = useState<GraphData[] | undefined>()
  const mapStyle = useMapStyle()
  const temporalgrid = mapStyle?.metadata?.temporalgrid
  const numSublayers = temporalgrid?.numSublayers
  const timeChunks = temporalgrid?.timeChunks as TimeChunks
  const interval = temporalgrid?.timeChunks?.interval
  const { features: cellFeatures, sourceLoaded } = useMapTemporalgridFeatures({
    cacheKey: interval,
  })
  const activeTimeChunk = timeChunks?.chunks.find((c: any) => c.active) as TimeChunk
  const chunkQuantizeOffset = activeTimeChunk?.quantizeOffset

  useEffect(() => {
    const updateTimeseries = async (
      allFeatures: GeoJSON.Feature<GeoJSON.Geometry>[],
      analysisAreaFeature: Feature<Geometry>
    ) => {
      setGeneratingTimeseries(true)
      const filteredFeatures = await filterByPolygon(allFeatures, analysisAreaFeature.geometry)
      const valuesContained = getTimeSeries(
        (filteredFeatures.contained || []) as any,
        numSublayers,
        chunkQuantizeOffset
      ).map((frameValues) => {
        return {
          value: frameValues[0],
          date: new Date(quantizeOffsetToDate(frameValues.frame, interval).getTime()).toISOString(),
        }
      })

      const allFilteredFeatues = [
        ...(filteredFeatures.contained || []),
        ...(filteredFeatures.overlapping || []),
      ]
      const valuesOverlapping = getTimeSeries(
        allFilteredFeatues as any,
        numSublayers,
        chunkQuantizeOffset
      ).map((frameValues) => {
        return {
          value: frameValues[0],
          date: new Date(quantizeOffsetToDate(frameValues.frame, interval).getTime()).toISOString(),
        }
      })

      const timeseries = valuesOverlapping.map(({ value, date }) => {
        const min = valuesContained.find((overlap) => overlap.date === date)?.value
        return {
          date,
          min: min ? min / VALUE_MULTIPLIER : 0,
          max: value / VALUE_MULTIPLIER,
        }
      })
      setTimeseries(timeseries)
      setGeneratingTimeseries(false)
    }

    if (cellFeatures && cellFeatures.length > 0) {
      const allFeatures = cellFeatures.map(({ properties, geometry }) => ({
        type: 'Feature' as any,
        properties,
        geometry,
      }))

      if (allFeatures?.length && analysisAreaFeature) {
        updateTimeseries(allFeatures, analysisAreaFeature)
      } else {
        setGeneratingTimeseries(false)
      }
    } else {
      setTimeseries(undefined)
    }
  }, [analysisAreaFeature, numSublayers, interval, cellFeatures, chunkQuantizeOffset])

  const timeSeriesFiltered = useMemo(() => {
    return timeseries?.filter((current: any) => {
      const currentDate = DateTime.fromISO(current.date)
      const startDate = DateTime.fromISO(start)
      const endDate = DateTime.fromISO(end)
      return currentDate >= startDate && currentDate < endDate
    })
  }, [timeseries, start, end])

  if (!sourceLoaded || generatingTimeseries) return <Spinner className={styles.spinner} />

  if (!timeSeriesFiltered?.length) {
    return <p className={styles.emptyDataPlaceholder}>No data available</p>
  }

  return (
    <AnalysisGraph
      timeseries={timeSeriesFiltered}
      graphColor={temporalGridDataviews?.[0]?.config?.color}
      timeChunkInterval={interval}
    />
  )
}

export default AnalysisGraphWrapper
