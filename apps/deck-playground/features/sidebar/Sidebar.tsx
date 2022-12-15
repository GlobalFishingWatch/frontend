import { Fragment } from 'react'
import {
  useFourwingsLayerInstance,
  useFourwingsLayerLoaded,
} from 'layers/fourwings/fourwings.hooks'
import {
  useRemoveVesselInLayer,
  useVesselsLayerIds,
  useVesselsLayerInstance,
} from 'layers/vessel/vessels.hooks'
import { Button, IconButton, Switch } from '@globalfishingwatch/ui-components'
import { MapLayer, useMapLayers } from 'features/map/layers.hooks'
import styles from './Sidebar.module.css'
import SidebarHeader from './SidebarHeader'

function Sidebar() {
  const [layers, setMapLayers] = useMapLayers()
  const fourwingsLayerInstance = useFourwingsLayerInstance()
  const vesselsLayerInstance = useVesselsLayerInstance()
  const fourwingsLayerLoaded = useFourwingsLayerLoaded()
  const vesselIds = useVesselsLayerIds()
  const removeVesselId = useRemoveVesselInLayer()

  const getVesselsEventsData = () => {
    const vesselsEvents = vesselsLayerInstance
      .getVesselsLayers()
      .reduce((acc, l) => [...acc, l.getVesselEventsData()], [])
    console.log(vesselsEvents)
  }

  const getFourwingsData = () => {
    const data =
      fourwingsLayerInstance?.getMode() === 'heatmap'
        ? fourwingsLayerInstance.getHeatmapTimeseries()
        : fourwingsLayerInstance.getVesselPositions()
    console.log(data)
  }

  const changeFourwingsResolution = () => {
    setMapLayers((layers) =>
      layers.map((l) => {
        if (l.id === 'fourwings') {
          return {
            ...l,
            resolution: l.resolution === 'high' ? 'default' : 'high',
          }
        }
        return l
      })
    )
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
  const fourwingsMode = fourwingsLayerInstance?.getMode()
  const fourwingsResolution = fourwingsLayerInstance?.getResolution()
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
                  <div>Vessels ({vesselIds?.length} loaded)</div>
                </div>
                {layer.visible && (
                  <Fragment>
                    <ul>
                      {vesselIds?.length > 0 &&
                        vesselIds.map((vessel) => (
                          <li>
                            {vessel}{' '}
                            <IconButton
                              icon="delete"
                              onClick={() => removeVesselId(vessel)}
                            ></IconButton>
                          </li>
                        ))}
                    </ul>
                    <div>
                      <Button size="small" onClick={getVesselsEventsData}>
                        LOG VESSELS EVENTS DATA
                      </Button>
                    </div>
                  </Fragment>
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
                <div>
                  4wings layer
                  {fourwingsMode && <label>Mode: {fourwingsMode}</label>}
                </div>
              </div>
              {layer.visible && (
                <div>
                  <div>
                    <label>Color breaks</label>
                    {fourwingsLayerInstance && (
                      <ul className={styles.list}>
                        {fourwingsLayerInstance.getColorDomain()?.map((step) => (
                          <li key={step}>{step},</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Button
                    size="small"
                    onClick={getFourwingsData}
                    loading={!fourwingsLayerLoaded}
                    disabled={!fourwingsLayerLoaded}
                  >
                    {fourwingsMode === 'heatmap' ? 'LOG 4WINGS DATA' : 'LOG VESSEL POSITIONS'}
                  </Button>
                  {fourwingsMode === 'heatmap' && fourwingsLayerLoaded && (
                    <Button size="small" onClick={changeFourwingsResolution}>
                      {fourwingsResolution === 'high' ? 'lower def' : 'higher def'}
                    </Button>
                  )}
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
