import { useEffect, useRef, useState } from 'react'
import { geoEqualEarth, geoPath } from 'd3'
import Pbf from 'pbf'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { Spinner } from '@globalfishingwatch/ui-components'
import { segmentsToGeoJSON, trackValueArrayToSegments } from '@globalfishingwatch/data-transforms'
import { Field } from '@globalfishingwatch/api-types'
import { useOnScreen } from 'hooks/screen.hooks'
import styles from './TrackFootprint.module.css'

type TrackFootprintProps = {
  vesselId: string
}

const FOOTPRINT_WIDTH = 300
const FOOTPRINT_HEIGHT = 150

function readData(_, data, pbf) {
  data.push(pbf.readPackedSVarint())
}

function TrackFootprint({ vesselId }: TrackFootprintProps) {
  const [loading, setLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const onScreen = useOnScreen(canvasRef)

  const fetchData = async (vesselId) => {
    const geoJson = await GFWAPI.fetch<any>(
      `/vessels/${vesselId}/tracks?binary=true&fields=lonlat%2Ctimestamp&format=valueArray&datasets=public-global-fishing-tracks%3Av20201001&distance-fishing=100000000&bearing-val-fishing=10000000&change-speed-fishing=5000000&min-accuracy-fishing=3000000&distance-transit=100000000&bearing-val-transit=1000000&change-speed-transit=1000000&min-accuracy-transit=60000`,
      { responseType: 'arrayBuffer' }
    ).then((arrayBuffer) => {
      const data = new Pbf(arrayBuffer).readFields(readData, [])[0]
      const segments = trackValueArrayToSegments(data, [Field.lonlat, Field.timestamp])
      return segmentsToGeoJSON(segments)
    })
    const context = canvasRef?.current?.getContext('2d')
    if (context && geoJson) {
      setLoading(false)
      const projection = geoEqualEarth()
        .scale(53.5)
        .translate([FOOTPRINT_WIDTH / 2, FOOTPRINT_HEIGHT / 2])
      const path = geoPath(projection, context)
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.lineWidth = 6
      geoJson.features.forEach((feature) => {
        // const { times } = feature.properties.coordinateProperties
        // context.strokeStyle =times[0] <= start || times[times.length - 1] >= end ? '#A8BCD5' : '#42639C'

        context.strokeStyle = '#42639C'
        context.beginPath()
        path(feature)
        context.stroke()
      })
    }
  }

  useEffect(() => {
    if (onScreen) {
      fetchData(vesselId)
    }
  }, [onScreen, vesselId])

  return (
    <div className={styles.map}>
      <canvas width={FOOTPRINT_WIDTH} height={FOOTPRINT_HEIGHT} ref={canvasRef} />
      {loading && <Spinner size="small" className={styles.spinner} />}
    </div>
  )
}

export default TrackFootprint
