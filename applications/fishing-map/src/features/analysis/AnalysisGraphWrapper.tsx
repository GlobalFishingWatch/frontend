import React from 'react'
import type { Geometry, Polygon, MultiPolygon } from 'geojson'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import simplify from '@turf/simplify'
import { useSelector } from 'react-redux'
import { getTimeSeries } from '@globalfishingwatch/fourwings-aggregate'
import { quantizeOffsetToDate, TimeChunk, TimeChunks } from '@globalfishingwatch/layer-composer'
import { MapboxGeoJSONFeature } from '@globalfishingwatch/mapbox-gl'
import { useMapboxInstance } from 'features/map/map.context'
import { useCurrentTimeChunkId, useMapStyle } from 'features/map/map.hooks'
import { selectTemporalgridDataviews } from 'features/workspace/workspace.selectors'
import AnalysisGraph from './AnalysisGraph'
import { selectAnalysisGeometry } from './analysis.slice'

const filterByPolygon = (features: MapboxGeoJSONFeature[], polygon: Geometry) => {
  // const n = performance.now()
  const simplifiedPoly = simplify(polygon as Polygon | MultiPolygon, { tolerance: 0.1 })
  const filtered = features.filter((f) => {
    const coord = (f.geometry as any).coordinates[0][0]
    return booleanPointInPolygon(coord, simplifiedPoly as Polygon | MultiPolygon)
  })
  // console.log('filter: ', performance.now() - n)
  return filtered
}

function AnalysisGraphWrapper() {
  const temporalGridDataviews = useSelector(selectTemporalgridDataviews)
  const mapInstance = useMapboxInstance()
  const currentTimeChunkId = useCurrentTimeChunkId()
  const analysisAreaFeature = useSelector(selectAnalysisGeometry)
  const mapStyle = useMapStyle()
  const temporalgrid = mapStyle.metadata?.temporalgrid
  if (!temporalgrid) return null

  const numSublayers = temporalgrid.numSublayers
  const timeChunks = temporalgrid.timeChunks as TimeChunks
  const activeTimeChunk = timeChunks?.chunks.find((c: any) => c.active) as TimeChunk
  const chunkQuantizeOffset = activeTimeChunk.quantizeOffset
  const allFeatures = mapInstance?.querySourceFeatures(currentTimeChunkId, {
    sourceLayer: 'temporalgrid_interactive',
  })
  let filteredFeatures
  if (allFeatures && analysisAreaFeature) {
    filteredFeatures = filterByPolygon(allFeatures, analysisAreaFeature.geometry)
  }
  if (!filteredFeatures) {
    return null
  }
  const visibleTemporalGridDataviews = temporalGridDataviews?.map(
    (dataview) => dataview.config?.visible ?? false
  )
  const values = getTimeSeries(filteredFeatures as any, numSublayers, chunkQuantizeOffset).map(
    (frameValues) => {
      return {
        value: frameValues[0],
        date: new Date(
          quantizeOffsetToDate(frameValues.frame, timeChunks.interval).getTime()
        ).toISOString(),
      }
    }
  )
  return <AnalysisGraph timeseries={values} />
}

export default AnalysisGraphWrapper
