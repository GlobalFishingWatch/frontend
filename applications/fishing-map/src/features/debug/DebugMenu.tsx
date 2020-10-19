import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch } from '@globalfishingwatch/ui-components'
import { selectDebugOptions, toggleOption } from './debug.slice'
import styles from './DebugMenu.module.css'

function DebugMenu() {
  const dispatch = useDispatch()
  const debugOptions = useSelector(selectDebugOptions)
  return (
    <div className={styles.row}>
      <div className={styles.header}>
        <Switch active={debugOptions.blob} onClick={() => dispatch(toggleOption('blob'))} />
        <label htmlFor="option_blob">
          [experimental] Render fishing layer with smooth heatmap style
        </label>
      </div>
      <p>
        Use a smoother rendering style. Only works when a single fishing layer is shown. Will
        disable interaction on this layer.
      </p>
      <div className={styles.header}>
        <Switch active={debugOptions.extruded} onClick={() => dispatch(toggleOption('extruded'))} />
        <label htmlFor="option_extruded">
          [experimental] Render fishing layer with stacked 3D bars
        </label>
      </div>
      <p>Renders fishing activity as stacked 3D bars. Will disable interaction on this layer.</p>
    </div>
  )
}

export default DebugMenu
