import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useTracksSublayers } from 'layers/tracks/tracks.hooks'
import { WebMercatorViewport } from '@deck.gl/core/typed'
import { Button, IconButton, InputText, Spinner, Switch } from '@globalfishingwatch/ui-components'
import { useViewport } from 'features/map/map-viewport.hooks'
import styles from './Sidebar.module.css'

function VesselsSection({ lastUpdate }) {
  const [query, setQuery] = useState('')
  const [sublayerWaitingToLoad, setSublayerWaitingToLoad] = useState('')
  const { setMapCoordinates } = useViewport()
  const { allLoaded, sublayers, toggleTrackSublayer, addTrackSublayer, removeTrackSublayer } =
    useTracksSublayers()

  const fitBoundsToSublayer = useCallback(
    (id: string) => {
      const sublayer = sublayers.find((sublayer) => sublayer.id === id)
      if (sublayer) {
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
    },
    [setMapCoordinates, sublayers]
  )

  useEffect(() => {
    if (sublayerWaitingToLoad && allLoaded) {
      fitBoundsToSublayer(sublayerWaitingToLoad)
      setSublayerWaitingToLoad('')
      setQuery('')
    }
  }, [fitBoundsToSublayer, allLoaded, sublayerWaitingToLoad])

  const onQueryInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const onSearchVesselClick = () => {
    addTrackSublayer(query)
    setSublayerWaitingToLoad(query)
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
        <Button disabled={!lastUpdate} onClick={onSearchVesselClick}>
          Find in map
        </Button>
      </div>
      <div className={styles.vessels}>
        <label>Tracks (transmission in last 72 hours)</label>
        {sublayers?.length > 0 ? (
          sublayers.map((sublayer) => {
            const { id, active, path, color } = sublayer

            return (
              <div key={id} className={styles.sublayer}>
                <Switch
                  className={styles.switch}
                  active={active}
                  onClick={() => toggleTrackSublayer(id)}
                  color={color}
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
                      onClick={() => fitBoundsToSublayer(id)}
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
          })
        ) : (
          <span>Search vessels or click on vessel icons on the map to load their tracks</span>
        )}
      </div>
    </section>
  )
}

export default VesselsSection
