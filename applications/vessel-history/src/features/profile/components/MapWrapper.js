import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import geobuf from 'geobuf'
import Pbf from 'pbf'
import GFWAPI from '@globalfishingwatch/api-client'
import { InteractiveMap } from '@globalfishingwatch/react-map-gl'
import styles from './Map.module.css'

function fetchTrack(vesselId) {
  return GFWAPI.fetch(`/vessels/${vesselId}/tracks?binary=true`, { json: false })
    .then((r) => r.arrayBuffer())
    .then((buffer) => geobuf.decode(new Pbf(buffer)))
}

function MapWrapper({ vesselID, setLastPosition }) {
  const [tracks, setTracks] = useState([])
  const [attributions, setAttributions] = useState([])
  const [attributionsVisible, setAttributionsVisible] = useState([])

  useEffect(() => {
    fetchTrack(vesselID).then((track) => {
      const lastPositionIndex = track.features.length - 1
      const lastPositionTimesIndex =
        track.features[lastPositionIndex].properties.coordinateProperties.times.length - 1
      const lastPositionCoordinates =
        track.features[lastPositionIndex].geometry.coordinates[lastPositionTimesIndex]
      setLastPosition(lastPositionCoordinates)
      setTracks([
        { id: vesselID, data: track, color: '#FE81EB', type: 'geojson', fitBoundsOnLoad: true },
      ])
    })
  }, [setLastPosition, vesselID])

  const onAttributionsChange = (attributions) => {
    setAttributions(attributions)
  }
  const toggleAttribution = () => {
    setAttributionsVisible((state) => !state.attributionsVisible)
  }

  return (
    <div className={styles.Map}>
      <InteractiveMap tracks={tracks} onAttributionsChange={onAttributionsChange} />
      <div className={styles.attributions}>
        {attributionsVisible === true && (
          <span
            className={styles.attributionsContent}
            dangerouslySetInnerHTML={{ __html: attributions.join(' · ') }}
          />
        )}
        <button onClick={toggleAttribution} className={styles.attributionsButton}>
          Map info
        </button>
      </div>
    </div>
  )
}

MapWrapper.propTypes = {
  vesselID: PropTypes.string.isRequired,
  setLastPosition: PropTypes.func.isRequired,
}

export default MapWrapper
