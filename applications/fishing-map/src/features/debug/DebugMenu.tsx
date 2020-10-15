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
        <label htmlFor="option_blob">Render heatmap layer with blob style</label>
      </div>
      <p>
        Use a smoother rendering style. Only works when a single fishing layer is shown. Will
        disbale interaction on this layer
      </p>
    </div>
  )
}

export default DebugMenu
