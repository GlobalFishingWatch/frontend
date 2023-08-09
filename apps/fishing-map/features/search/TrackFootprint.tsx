import { useCallback, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { geoEqualEarth, geoPath } from 'd3'
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'
import { DateTime } from 'luxon'
import qs from 'qs'
import { GFWAPI, THINNING_LEVELS } from '@globalfishingwatch/api-client'
import { Icon, Spinner } from '@globalfishingwatch/ui-components'
import { segmentsToGeoJSON, trackValueArrayToSegments } from '@globalfishingwatch/data-transforms'
import { Field } from '@globalfishingwatch/api-types'
import { useOnScreen } from 'hooks/screen.hooks'
import styles from './TrackFootprint.module.css'

type TrackFootprintProps = {
  vesselIds: string[]
  trackDatasetId?: string
  highlightedYear?: number
  onDataLoad?: (data: FeatureCollection) => void
}

const FOOTPRINT_WIDTH = 300
const FOOTPRINT_HEIGHT = 150

const PROJECTION = geoEqualEarth()
  .scale(53.5)
  .translate([FOOTPRINT_WIDTH / 2, FOOTPRINT_HEIGHT / 2])

const TRACK_FOOTPRINT_QUERY = {
  ...THINNING_LEVELS.Footprint,
  binary: true,
  fields: 'lonlat,timestamp',
  format: 'valueArray',
}

function TrackFootprint({
  vesselIds,
  trackDatasetId,
  highlightedYear,
  onDataLoad,
}: TrackFootprintProps) {
  const [trackData, setTrackData] = useState<FeatureCollection<Geometry, GeoJsonProperties>>()
  const [error, setError] = useState(false)
  const fullCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const highlightCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const onScreen = useOnScreen(fullCanvasRef)
  const fullContext = fullCanvasRef.current?.getContext('2d')
  const highlightContext = highlightCanvasRef.current?.getContext('2d')

  const fetchData = useCallback(
    async (vesselIds: string[]) => {
      if (!trackDatasetId) {
        setError(true)
        return
      }
      const vesselsData = vesselIds.map((id) => {
        return GFWAPI.fetch<any>(
          `/vessels/${id}/tracks?${qs.stringify({
            ...TRACK_FOOTPRINT_QUERY,
            datasets: trackDatasetId,
          })}`,
          {
            responseType: 'vessel',
          }
        )
      })

      const promises = await Promise.allSettled(vesselsData)
      const tracksData = promises.map((d) => (d.status === 'fulfilled' ? d.value : []))

      if (tracksData.length === 0) {
        setError(true)
        return
      }

      const segments = tracksData.flatMap((data) =>
        trackValueArrayToSegments(data, [Field.lonlat, Field.timestamp])
      )
      const geoJson = segmentsToGeoJSON(segments)
      setTrackData(geoJson)
      if (onDataLoad) onDataLoad(geoJson)
    },
    [onDataLoad, trackDatasetId]
  )

  useEffect(() => {
    if (onScreen && !trackData && vesselIds?.length) {
      fetchData(vesselIds)
    }
  }, [fetchData, onScreen, trackData, vesselIds])

  useEffect(() => {
    if (fullContext && trackData) {
      const fullPath = geoPath(PROJECTION, fullContext)
      fullContext.lineCap = 'round'
      fullContext.lineJoin = 'round'
      fullContext.lineWidth = 3
      fullContext.strokeStyle = '#42639C'
      trackData.features.forEach((feature) => {
        fullContext.beginPath()
        fullPath(feature)
        fullContext.stroke()
      })
    }
  }, [fullContext, trackData, vesselIds])

  useEffect(() => {
    highlightContext?.clearRect(0, 0, FOOTPRINT_WIDTH, FOOTPRINT_HEIGHT)
    const highlightPath = geoPath(PROJECTION, highlightContext)
    if (trackData && highlightedYear && highlightContext) {
      const highlightedYearDateTime = DateTime.fromObject({ year: highlightedYear })
      const highlightStart = highlightedYearDateTime.toMillis()
      const highlightEnd = highlightedYearDateTime.plus({ year: 1 }).toMillis()
      const highlightedTrack = {
        ...trackData,
        features: trackData.features.flatMap((feature) => {
          const featureTimes = feature.properties?.coordinateProperties.times
          if (
            featureTimes[featureTimes.length - 1] < highlightStart ||
            featureTimes[0] > highlightEnd
          ) {
            return []
          }
          return {
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: (feature.geometry as any).coordinates.filter(
                (_, index) =>
                  featureTimes[index] > highlightStart && featureTimes[index] < highlightEnd
              ),
            },
          }
        }),
      }
      highlightContext.lineCap = 'round'
      highlightContext.lineJoin = 'round'
      highlightContext.lineWidth = 6
      highlightContext.strokeStyle = '#42639C'
      highlightedTrack.features.forEach((feature) => {
        highlightContext.beginPath()
        highlightPath(feature)
        highlightContext.stroke()
      })
    }
  }, [highlightContext, highlightedYear, trackData])

  return (
    <div className={styles.map}>
      <canvas
        className={cx({ [styles.faint]: highlightedYear })}
        width={FOOTPRINT_WIDTH}
        height={FOOTPRINT_HEIGHT}
        ref={fullCanvasRef}
      />
      <canvas width={FOOTPRINT_WIDTH} height={FOOTPRINT_HEIGHT} ref={highlightCanvasRef} />
      {!trackData && !error && vesselIds?.length && (
        <Spinner size="small" className={styles.spinner} />
      )}
      {error && <Icon icon="warning" type="warning" />}
    </div>
  )
}

export default TrackFootprint
