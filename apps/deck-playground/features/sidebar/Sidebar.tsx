import { VesselsLayer } from 'layers/vessel/VesselsLayer'
import { Button, Switch } from '@globalfishingwatch/ui-components'
import { VESSEL_IDS } from 'data/vessels'
import { MapLayer, useMapLayers } from 'features/map/layers.hooks'
import styles from './Sidebar.module.css'
import SidebarHeader from './SidebarHeader'

function Sidebar() {
  const [layers, setMapLayers] = useMapLayers()

  const getFirstVesselData = () => {
    const vesselsLayerInstance = layers.find((l) => l.id === 'vessel')?.instance as VesselsLayer
    console.log('First Vessel Data')
    console.log(vesselsLayerInstance.getVesselsLayer()?.[0].getTrackLayer().getSegments())
  }

  const getFourwingsData = () => {
    const fourwingsLayerInstance: any = layers.find((l) => l.id === 'fourwings')?.instance
    const data = fourwingsLayerInstance.getDataFilteredByViewport()
    console.log('Fourwings viewport data')
    console.log(data)
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
                <div className={styles.header}>
                  <Switch
                    className={styles.switch}
                    active={layer.visible}
                    onClick={() => onLayerVisibilityClick(layer)}
                  />
                  <div>Vessels ({VESSEL_IDS.length} loaded)</div>
                </div>
                {layer.visible && (
                  <div>
                    <Button size="small" onClick={getFirstVesselData}>
                      LOG FIRST VESSEL DATA
                    </Button>
                  </div>
                )}
              </div>
            )
          }
          return (
            <div key={layer.id} className={styles.row}>
              <div className={styles.header}>
                <Switch
                  className={styles.switch}
                  active={layer.visible}
                  onClick={() => onLayerVisibilityClick(layer)}
                />
                <div>4wings layer</div>
              </div>
              {layer.visible && (
                <div>
                  <Button
                    size="small"
                    onClick={getFourwingsData}
                    loading={!layer.loaded}
                    disabled={!layer.loaded}
                  >
                    LOG LOADED 4WINGS DATA
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar
