import { Button, Switch } from '@globalfishingwatch/ui-components'
import { VESSEL_IDS } from 'data/vessels'
import { MapLayer, useMapLayers } from 'features/map/layers.hooks'
import styles from './Sidebar.module.css'
import SidebarHeader from './SidebarHeader'

function Sidebar() {
  const [layers, setMapLayers] = useMapLayers()

  const getFirstVesselData = () => {
    const vesselLayerInstances = layers.find((l) => l.id === 'vessel')?.instances?.[0]
    console.log('getFirstVesselData', vesselLayerInstances.getSegments())
  }

  const onLayerVisibilityClick = (layer: MapLayer) => {
    setMapLayers((layers) =>
      layers.map((l) => {
        if (l.id === layer.id) {
          return { ...l, visible: !l.visible }
        }
        return l
      })
    )
  }

  return (
    <div className={styles.container}>
      <div className="scrollContainer">
        <SidebarHeader />
        {layers.map((layer) => {
          if (layer.id === 'vessel') {
            return (
              <div key={layer.id} className={styles.row}>
                <Switch active={layer.visible} onClick={() => onLayerVisibilityClick(layer)} />
                <div>Vessels ({VESSEL_IDS.length} loaded)</div>
                {layer.visible && (
                  <div>
                    <Button onClick={getFirstVesselData}>LOG FIRST VESSEL DATA</Button>
                  </div>
                )}
              </div>
            )
          }
          return (
            <div key={layer.id} className={styles.row}>
              <Switch active={layer.visible} onClick={() => onLayerVisibilityClick(layer)} />
              <div>4wings layer</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar
