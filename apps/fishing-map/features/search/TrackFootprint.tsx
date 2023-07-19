import { useEffect, useRef, useState } from 'react'
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
  highlightedYear?: number
}

const FOOTPRINT_WIDTH = 300
const FOOTPRINT_HEIGHT = 150

const PROJECTION = geoEqualEarth()
  .scale(53.5)
  .translate([FOOTPRINT_WIDTH / 2, FOOTPRINT_HEIGHT / 2])

function TrackFootprint({ vesselId, highlightedYear }: TrackFootprintProps) {
  const [trackData, setTrackData] = useState<FeatureCollection<Geometry, GeoJsonProperties>>()
  const [error, setError] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const onScreen = useOnScreen(canvasRef)

  const fetchData = async (vesselId: string) => {
    const data = await GFWAPI.fetch<any>(
      `/vessels/${vesselId}/tracks?binary=true&fields=lonlat%2Ctimestamp&format=valueArray&datasets=public-global-fishing-tracks%3Av20201001&distance-fishing=1000000000&bearing-val-fishing=10000000&change-speed-fishing=5000000&min-accuracy-fishing=3000000&distance-transit=100000000&bearing-val-transit=1000000&change-speed-transit=1000000&min-accuracy-transit=60000`,
      { responseType: 'vessel' }
    )
    if (data.length === 0) {
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
    const context = canvasRef.current?.getContext('2d')
    if (context && trackData) {
      const path = geoPath(PROJECTION, context)
      context.clearRect(0, 0, FOOTPRINT_WIDTH, FOOTPRINT_HEIGHT)
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.lineWidth = 6
      context.strokeStyle = highlightedYear ? '#42639C22' : '#42639C'
      trackData.features.forEach((feature) => {
        context.beginPath()
        path(feature)
        context.stroke()
      })

      if (highlightedYear) {
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

        context.strokeStyle = '#42639C'
        highlightedTrack.features.forEach((feature) => {
          context.beginPath()
          path(feature)
          context.stroke()
        })
      }
    }
  }, [highlightedYear, trackData, vesselId])

  return (
    <div className={styles.map}>
      <canvas width={FOOTPRINT_WIDTH} height={FOOTPRINT_HEIGHT} ref={canvasRef} />
      {!trackData && !error && <Spinner size="small" className={styles.spinner} />}
      {error && <Icon icon="warning" type="warning" />}
    </div>
  )
}

export default TrackFootprint
