import type { ChangeEvent} from 'react';
import { Fragment, useCallback, useEffect, useState } from 'react'
import { WebMercatorViewport } from '@deck.gl/core'
import { saveAs } from 'file-saver'
import type { TrackPoint} from 'layers/tracks/tracks.hooks';
import { useTracksSublayers } from 'layers/tracks/tracks.hooks'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { Button, IconButton, InputText, Spinner, Switch } from '@globalfishingwatch/ui-components'

import { API_BASE } from 'data/config'
import { useViewport } from 'features/map/map-viewport.hooks'
import { convertToTrackCSV } from 'utils/coordinates'

import styles from './Sidebar.module.css'

function VesselsSection({ lastUpdate }) {
  const [query, setQuery] = useState('')
  const [showDownloadOptions, setShowDownloadOptions] = useState('')
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
        sublayer.data[0].forEach(({ coordinates }) => {
          const [x, y] = coordinates
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
          { padding: 40, maxZoom: 20 }
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
    if (e.target.value === '' || Number(e.target.value)) {
      setQuery(e.target.value)
    }
  }

  const onSearchVesselClick = () => {
    if (query) {
      addTrackSublayer(query)
      setSublayerWaitingToLoad(query)
    }
  }

  const onDownloadClick = async (
    id: string,
    data: TrackPoint[][],
    format: 'points' | 'lines' | 'csv' = 'csv'
  ) => {
    let formatData: any = data

    if (format === 'csv') {
      formatData = convertToTrackCSV(data[0])
      const blob = new Blob([formatData], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, id + '.csv')
      return
    }

    if (format === 'lines') {
      formatData = await GFWAPI.fetch(
        `${API_BASE}/realtime-tracks/${id}?start-date=${lastUpdate}&format=lines`
      )
    } else {
      formatData = {
        type: 'FeatureCollection',
        features: data[0].map(({ coordinates, timestamp }) => ({
          type: 'Feature',
          properties: { timestamp },
          geometry: {
            type: 'Point',
            coordinates,
          },
        })),
      }
    }
    const blob = new Blob([JSON.stringify(formatData)], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, id + '.geo.json')
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
            const { id, active, data, color } = sublayer
            const downloadOptionsOpen = showDownloadOptions === id
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
                    {data?.[0].length > 0 ? (
                      <span className={styles.secondary}>({data[0].length})</span>
                    ) : (
                      <Spinner size="tiny" />
                    )}
                  </h3>
                  {active && data?.[0].length > 0 && (
                    <Fragment>
                      <IconButton
                        size="small"
                        icon="target"
                        onClick={() => fitBoundsToSublayer(id)}
                        tooltip="Center map on track"
                        tooltipPlacement="top"
                      />
                      <div className={styles.downloadOptionsContainer}>
                        <IconButton
                          size="small"
                          icon={downloadOptionsOpen ? 'close' : 'download'}
                          onClick={() =>
                            downloadOptionsOpen
                              ? setShowDownloadOptions('')
                              : setShowDownloadOptions(id)
                          }
                          tooltip={downloadOptionsOpen ? 'Close' : 'Download track'}
                          tooltipPlacement="top"
                          className={styles.downloadOptionsButton}
                        />
                        {downloadOptionsOpen && (
                          <div className={styles.downloadOptionsList}>
                            <div
                              onClick={() => onDownloadClick(id, data, 'csv')}
                              className={styles.downloadOption}
                            >
                              CSV
                            </div>
                            <div
                              onClick={() => onDownloadClick(id, data, 'points')}
                              className={styles.downloadOption}
                            >
                              GeoJSON Points
                            </div>
                            <div
                              onClick={() => onDownloadClick(id, data, 'lines')}
                              className={styles.downloadOption}
                            >
                              GeoJSON Line
                            </div>
                          </div>
                        )}
                      </div>
                    </Fragment>
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
