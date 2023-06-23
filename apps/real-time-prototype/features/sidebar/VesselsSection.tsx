import { ChangeEvent, useState } from 'react'
import { useLatestPositionsLayerInstance } from 'layers/latest-positions/latest-positions.hooks'
import { useAddTrackInLayer } from 'layers/tracks/tracks.hooks'
import { Button, InputText } from '@globalfishingwatch/ui-components'
import { useMapLayers } from 'features/map/layers.hooks'
import { useViewport } from 'features/map/map-viewport.hooks'
import styles from './Sidebar.module.css'

function VesselsSection() {
  const [query, setQuery] = useState('412549174')
  const [layers] = useMapLayers()
  const latestPositionsLayer = useLatestPositionsLayerInstance()
  const { setMapCoordinates } = useViewport()
  const addTrackLayer = useAddTrackInLayer()

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
      addTrackLayer(matchedVessel.mmsi)
    }
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
      {/* {vessels.map((id) => (
        <div key={id} className={styles.header}>
          <Switch
            className={styles.switch}
            active={contextIds.includes(id)}
            onClick={() => handleContextLayerToggle(id)}
          />
          <span>{id}</span>
        </div>
      ))} */}
    </section>
  )
}

export default VesselsSection
