import { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { geoEqualEarth, geoPath } from 'd3'
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'
import { DateTime } from 'luxon'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { Icon, Spinner } from '@globalfishingwatch/ui-components'
import { segmentsToGeoJSON, trackValueArrayToSegments } from '@globalfishingwatch/data-transforms'
import { Field } from '@globalfishingwatch/api-types'
import { useOnScreen } from 'hooks/screen.hooks'
import styles from './TrackFootprint.module.css'

type TrackFootprintProps = {
  vesselId: string
  trackDatasetId?: string
  highlightedYear?: number
}

const FOOTPRINT_WIDTH = 300
const FOOTPRINT_HEIGHT = 150

const PROJECTION = geoEqualEarth()
  .scale(53.5)
  .translate([FOOTPRINT_WIDTH / 2, FOOTPRINT_HEIGHT / 2])

function TrackFootprint({ vesselId, trackDatasetId, highlightedYear }: TrackFootprintProps) {
  const [trackData, setTrackData] = useState<FeatureCollection<Geometry, GeoJsonProperties>>()
  const [error, setError] = useState(false)
  const fullCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const highlightCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const onScreen = useOnScreen(fullCanvasRef)
  const fullContext = fullCanvasRef.current?.getContext('2d')
  const highlightContext = highlightCanvasRef.current?.getContext('2d')

  const fetchData = async (vesselId: string) => {
    if (!trackDatasetId) {
      setError(true)
      return
    }
    let data = await GFWAPI.fetch<any>(
      `/vessels/${vesselId}/tracks?binary=true&fields=lonlat%2Ctimestamp&format=valueArray&datasets=${trackDatasetId}&distance-fishing=1000000000&bearing-val-fishing=10000000&change-speed-fishing=5000000&min-accuracy-fishing=3000000&distance-transit=100000000&bearing-val-transit=1000000&change-speed-transit=1000000&min-accuracy-transit=60000`,
      { responseType: 'vessel' }
    )
    if (data.length === 0) {
      console.log(data)
      setError(true)
      return
    }

    const segments = trackValueArrayToSegments(data, [Field.lonlat, Field.timestamp])
    const geoJson = segmentsToGeoJSON(segments)
    setTrackData(geoJson)
  }

  useEffect(() => {
    if (onScreen && !trackData) {
      fetchData(vesselId)
    }
  }, [onScreen, trackData, vesselId])

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
  }, [fullContext, trackData, vesselId])

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
      {!trackData && !error && <Spinner size="small" className={styles.spinner} />}
      {error && <Icon icon="warning" type="warning" />}
    </div>
  )
}

export default TrackFootprint
