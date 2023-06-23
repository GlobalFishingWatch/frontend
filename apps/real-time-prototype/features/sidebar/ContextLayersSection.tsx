import {
  useRemoveContextInLayer,
  useAddContextInLayer,
  useContextsLayerIds,
} from 'layers/context/context.hooks'
import { CONTEXT_LAYERS_IDS } from 'layers/context/context.config'
import { Switch } from '@globalfishingwatch/ui-components'
import styles from './Sidebar.module.css'

function ContextLayersSection() {
  const removeContextId = useRemoveContextInLayer()
  const addContextId = useAddContextInLayer()
  const contextIds = useContextsLayerIds()

  const handleContextLayerToggle = (layerId) => {
    contextIds.includes(layerId) ? removeContextId(layerId) : addContextId(layerId)
  }

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

export default ContextLayersSection
