import { VesselsLayer } from 'layers/vessel/VesselsLayer'
import { useMemo } from 'react'
import { getFourwingsMode } from 'layers/fourwings/fourwings.utils'
import { useFourwingsLayerInstance } from 'layers/fourwings/fourwings.hooks'
import { Button, Switch } from '@globalfishingwatch/ui-components'
import { VESSEL_IDS } from 'data/vessels'
import { MapLayer, useMapLayers } from 'features/map/layers.hooks'
import { useViewport } from 'features/map/map-viewport.hooks'
import styles from './Sidebar.module.css'
import SidebarHeader from './SidebarHeader'

function Sidebar() {
  const [layers, setMapLayers] = useMapLayers()
  const { viewState } = useViewport()
  const fourwingsLayerInstance = useFourwingsLayerInstance()

  // const getFirstVesselData = () => {
  //   const vesselsLayerInstance = layers.find((l) => l.id === 'vessel')?.instance as VesselsLayer
  //   console.log('First Vessel Data')
  //   console.log(vesselsLayerInstance.getVesselsLayer()?.[0].getTrackLayer().getSegments())
  // }

  const getFourwingsData = () => {
    if (fourwingsLayerInstance) {
      const data = fourwingsLayerInstance.getHeatmapTimeseries()
      console.log('Fourwings timeseries')
      console.log(data)
    }
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
                    {/* <Button size="small" onClick={getFirstVesselData}>
                      LOG FIRST VESSEL DATA
                    </Button> */}
                  </div>
                )}
              </div>
            )
          }
          const fourwingsMode = getFourwingsMode(viewState.zoom)
          return (
            <div key={layer.id} className={styles.row}>
              <div className={styles.header}>
                <Switch
                  className={styles.switch}
                  active={layer.visible}
                  onClick={() => onLayerVisibilityClick(layer)}
                />
                <div>
                  4wings layer
                  <label>Mode: {fourwingsMode}</label>
                </div>
              </div>
              {layer.visible && (
                <div>
                  {fourwingsMode === 'heatmap' && (
                    <div>
                      <label>Steps</label>
                      {fourwingsLayerInstance && (
                        <ul className={styles.list}>
                          {fourwingsLayerInstance.getColorDomain()?.map((step) => (
                            <li key={step}>{step},</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
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
