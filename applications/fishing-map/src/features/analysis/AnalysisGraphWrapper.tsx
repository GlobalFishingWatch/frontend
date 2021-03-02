import React from 'react'
import type { Geometry, Polygon, MultiPolygon } from 'geojson'
import booleanContains from '@turf/boolean-contains'
import booleanOverlap from '@turf/boolean-overlap'
import simplify from '@turf/simplify'
import { useSelector } from 'react-redux'
import { getTimeSeries, VALUE_MULTIPLIER } from '@globalfishingwatch/fourwings-aggregate'
import { quantizeOffsetToDate, TimeChunk, TimeChunks } from '@globalfishingwatch/layer-composer'
import { MapboxGeoJSONFeature } from '@globalfishingwatch/mapbox-gl'
import { useMapboxInstance } from 'features/map/map.context'
import { useCurrentTimeChunkId, useMapStyle } from 'features/map/map.hooks'
import { selectTemporalgridDataviews } from 'features/workspace/workspace.selectors'
import AnalysisGraph from './AnalysisGraph'
import { selectAnalysisGeometry } from './analysis.slice'

// TODO review performance issues
const filterByPolygon = (features: MapboxGeoJSONFeature[], polygon: Geometry) => {
  // const n = performance.now()
  const simplifiedPoly = simplify(polygon as Polygon | MultiPolygon, { tolerance: 0.1 })
  const filtered = features.reduce(
    (acc, feature) => {
      const isContained =
        simplifiedPoly.type === 'MultiPolygon'
          ? simplifiedPoly.coordinates.some((coordinates) =>
              booleanContains({ type: 'Polygon', coordinates }, feature.geometry as Polygon)
            )
          : booleanContains(simplifiedPoly, feature.geometry as Polygon)

      if (isContained) {
        acc.contained.push(feature)
      } else {
        const overlaps = booleanOverlap(feature.geometry as Polygon, simplifiedPoly)
        if (overlaps) {
          acc.overlapping.push(feature)
        }
      }

      return acc
    },
    { contained: [] as MapboxGeoJSONFeature[], overlapping: [] as MapboxGeoJSONFeature[] }
  )
  // console.log('filter: ', performance.now() - n)
  return filtered
}

function AnalysisGraphWrapper() {
  const temporalGridDataviews = useSelector(selectTemporalgridDataviews)
  const mapInstance = useMapboxInstance()
  const currentTimeChunkId = useCurrentTimeChunkId()
  const analysisAreaFeature = useSelector(selectAnalysisGeometry)
  const mapStyle = useMapStyle()
  const temporalgrid = mapStyle?.metadata?.temporalgrid
  if (!temporalgrid) return null

  const numSublayers = temporalgrid.numSublayers
  const timeChunks = temporalgrid.timeChunks as TimeChunks
  const activeTimeChunk = timeChunks?.chunks.find((c: any) => c.active) as TimeChunk
  const chunkQuantizeOffset = activeTimeChunk.quantizeOffset
  const allFeatures = mapInstance?.querySourceFeatures(currentTimeChunkId, {
    sourceLayer: 'temporalgrid_interactive',
  })
  let filteredFeatures = {
    contained: [] as MapboxGeoJSONFeature[],
    overlapping: [] as MapboxGeoJSONFeature[],
  }
  if (allFeatures && analysisAreaFeature) {
    // TODO: move this UI blocker to a worker
    filteredFeatures = filterByPolygon(allFeatures, analysisAreaFeature.geometry)
  }
  if (!filteredFeatures.contained?.length || !filteredFeatures.overlapping?.length) {
    return null
  }
  const visibleTemporalGridDataviews = temporalGridDataviews?.map(
    (dataview) => dataview.config?.visible ?? false
  )
  const valuesContained = getTimeSeries(
    filteredFeatures.contained as any,
    numSublayers,
    chunkQuantizeOffset
  ).map((frameValues) => {
    return {
      value: frameValues[0],
      date: new Date(
        quantizeOffsetToDate(frameValues.frame, timeChunks.interval).getTime()
      ).toISOString(),
    }
  })
  const valuesOverlapping = getTimeSeries(
    [...filteredFeatures.contained, ...filteredFeatures.overlapping] as any,
    numSublayers,
    chunkQuantizeOffset
  ).map((frameValues) => {
    return {
      value: frameValues[0],
      date: new Date(
        quantizeOffsetToDate(frameValues.frame, timeChunks.interval).getTime()
      ).toISOString(),
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

  return (
    <AnalysisGraph timeseries={timeseries} graphColor={temporalGridDataviews?.[0]?.config?.color} />
  )
}

export default AnalysisGraphWrapper
