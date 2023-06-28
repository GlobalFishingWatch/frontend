import { ChangeEvent, useState } from 'react'
import { useLatestPositionsLayerInstance } from 'layers/latest-positions/latest-positions.hooks'
import { TrackSublayer, useTracksSublayers } from 'layers/tracks/tracks.hooks'
import { WebMercatorViewport } from '@deck.gl/core/typed'
import {
  Button,
  IconButton,
  InputText,
  LineColorBarOptions,
  Spinner,
  Switch,
} from '@globalfishingwatch/ui-components'
import { useViewport } from 'features/map/map-viewport.hooks'
import styles from './Sidebar.module.css'

function VesselsSection() {
  const [query, setQuery] = useState('412549174')
  const latestPositionsLayer = useLatestPositionsLayerInstance()
  const { setMapCoordinates } = useViewport()
  const { sublayers, toggleTrackSublayer, addTrackSublayer, removeTrackSublayer } =
    useTracksSublayers()

  const onQueryInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const onSearchVesselClick = () => {
    const matchedVessel = latestPositionsLayer.findVessel(query)
    console.log(query, matchedVessel)
    if (matchedVessel) {
      setMapCoordinates({
        latitude: matchedVessel.lat,
        longitude: matchedVessel.lon,
        zoom: 8,
      })
      addTrackSublayer(matchedVessel.mmsi)
    }
  }
  const fitBoundsToSublayer = (sublayer: TrackSublayer) => {
    let minX = 180
    let maxX = -180
    let minY = 90
    let maxY = -90
    sublayer.path.forEach(([x, y]) => {
      if (x > maxX) maxX = x
      if (x < minX) minX = x
      if (y > maxY) maxY = y
      if (y < minY) minY = y
    })
    const newViewport = new WebMercatorViewport({
      width: window.innerWidth - 320,
      height: window.innerHeight,
    })
    const { latitude, longitude, zoom } = newViewport.fitBounds(
      [
        [minX, minY],
        [maxX, maxY],
      ],
      { padding: 40 }
    )
    setMapCoordinates({ latitude, longitude, zoom })
  }

  return (
    <section className={styles.row} key={'vessels'}>
      <p>VESSELS</p>
      <div className={styles.search}>
        <InputText
          type="search"
          placeholder="Search by MMSI"
          value={query}
          onChange={onQueryInputChange}
        />
        <Button onClick={onSearchVesselClick}>Find in map</Button>
      </div>
      {sublayers?.length > 0 && (
        <div className={styles.vessels}>
          <label>Tracks (transmission in last 72 hours)</label>
          {sublayers.map((sublayer, index) => {
            const { id, active, path } = sublayer

            return (
              <div key={id} className={styles.sublayer}>
                <Switch
                  className={styles.switch}
                  active={active}
                  onClick={() => toggleTrackSublayer(id)}
                  color={LineColorBarOptions[index % LineColorBarOptions.length].value}
                  tooltip="Toggle vessel visibility"
                  tooltipPlacement="top"
                />
                <div className={styles.sublayerTitleRow}>
                  <h3 className={styles.sublayerTitle}>
                    {id}
                    {path ? (
                      <span className={styles.secondary}>({path.length})</span>
                    ) : (
                      <Spinner size="tiny" />
                    )}
                  </h3>
                  {active && path && (
                    <IconButton
                      size="small"
                      icon="target"
                      onClick={() => fitBoundsToSublayer(sublayer)}
                      tooltip="Center map on track"
                      tooltipPlacement="top"
                    />
                  )}
                  <IconButton
                    size="small"
                    icon="delete"
                    onClick={() => removeTrackSublayer(id)}
                    tooltip="Remove vessel"
                    tooltipPlacement="top"
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default VesselsSection
