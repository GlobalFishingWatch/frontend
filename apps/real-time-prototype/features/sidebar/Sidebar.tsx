import {
  useRemoveContextInLayer,
  useAddContextInLayer,
  useContextsLayerIds,
} from 'layers/context/context.hooks'
import { CONTEXT_LAYERS_IDS } from 'layers/context/context.config'
import { Switch } from '@globalfishingwatch/ui-components'
import { useMapLayers } from 'features/map/layers.hooks'
import styles from './Sidebar.module.css'
import SidebarHeader from './SidebarHeader'

function Sidebar() {
  const [layers, setMapLayers] = useMapLayers()
  const removeContextId = useRemoveContextInLayer()
  const addContextId = useAddContextInLayer()
  const contextIds = useContextsLayerIds()

  const handleContextLayerToggle = (layerId) => {
    contextIds.includes(layerId) ? removeContextId(layerId) : addContextId(layerId)
  }

  // return null

  return (
    <div className={styles.container}>
      <div className="scrollContainer">
        <SidebarHeader />
        {layers.map((layer) => {
          if (layer.id === 'contexts') {
            return (
              <section className={styles.row} key={'contexts'}>
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

          return null
        })}
      </div>
    </div>
  )
}

export default Sidebar
