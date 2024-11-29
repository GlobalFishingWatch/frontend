import type { RGBA } from 'color-blend/dist/types'
import { Switch } from '@globalfishingwatch/ui-components'
import { rgbaToString } from '@globalfishingwatch/layer-composer'
import { CONTEXT_LAYERS_IDS, CONTEXT_LAYERS_OBJECT } from 'layers/context/context.config'
import {
  useRemoveContextInLayer,
  useAddContextInLayer,
  useContextsLayerIds,
} from 'layers/context/context.hooks'
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
      {CONTEXT_LAYERS_IDS.map((id) => {
        const [r, g, b] = CONTEXT_LAYERS_OBJECT[id].lineColor
        return (
          <div key={id} className={styles.header}>
            <Switch
              className={styles.switch}
              active={contextIds.includes(id)}
              onClick={() => handleContextLayerToggle(id)}
              color={rgbaToString({ r, g, b } as RGBA)}
            />
            <span>{id}</span>
          </div>
        )
      })}
    </section>
  )
}

export default ContextLayersSection
