import { Fragment } from 'react'
import {
  FOURWINGS_SUBLAYERS,
  useFourwingsLayerInstance,
  useFourwingsLayerLoaded,
} from 'layers/fourwings/fourwings.hooks'
import {
  useRemoveVesselInLayer,
  useVesselsLayerIds,
  useVesselsLayerInstance,
} from 'layers/vessel/vessels.hooks'
import {
  useRemoveContextInLayer,
  useAddContextInLayer,
  useContextsLayerIds,
} from 'layers/context/context.hooks'
import { CONTEXT_LAYERS_IDS } from 'layers/context/context.config'
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
  const removeContextId = useRemoveContextInLayer()
  const addContextId = useAddContextInLayer()
  const contextIds = useContextsLayerIds()

  const getVesselsEventsData = () => {
    const vesselsEvents = vesselsLayerInstance
      .getVesselsLayers()
      .reduce((acc, l) => [...acc, l.getVesselEventsData()], [])
    console.log(vesselsEvents)
  }

  const getFourwingsData = () => {
    // const data =
    //   fourwingsLayerInstance?.getMode() === 'heatmap'
    //     ? fourwingsLayerInstance.getHeatmapTimeseries()
    //     : fourwingsLayerInstance.getVesselPositions()
    // console.log(data)
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

  const handleContextLayerToggle = (layerId) => {
    contextIds.includes(layerId) ? removeContextId(layerId) : addContextId(layerId)
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
                          <li key={vessel}>
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
          if (layer.id === 'contexts') {
            return (
              <section className={styles.row}>
                <p>CONTEXT LAYERS</p>
                {CONTEXT_LAYERS_IDS.map((id) => (
                  <div key={id} className={styles.header}>
                    <Switch
                      className={styles.switch}
                      active={contextIds.includes(id)}
                      onClick={() => handleContextLayerToggle(id)}
                    />
                    <span>{id}</span>
                  </div>
                ))}
              </section>
            )
          }
          if (layer.id === 'fourwings') {
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
                    {FOURWINGS_SUBLAYERS.map((sublayer) => (
                      <div className={styles.sublayer} key={sublayer.id}>
                        <span
                          style={{ backgroundColor: sublayer.config.color }}
                          className={styles.dot}
                        />
                        <label>{sublayer.id}</label>
                      </div>
                    ))}
                    <div>
                      <label>Color breaks</label>
                      {fourwingsLayerInstance && fourwingsLayerLoaded && (
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
          }
          return null
        })}
      </div>
    </div>
  )
}

export default Sidebar
