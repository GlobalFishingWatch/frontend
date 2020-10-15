import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectDebugOptions, toggleOption } from './debug.slice'
import styles from './DebugMenu.module.css'

function DebugMenu() {
  const dispatch = useDispatch()
  const debugOptions = useSelector(selectDebugOptions)
  return (
    <div className={styles.debugMenu}>
      <h1>Secret debug menu 🤖</h1>
      <div>
        <label htmlFor="option_blob">
          <input
            onChange={() => {
              dispatch(toggleOption('blob'))
            }}
            type="checkbox"
            id="option_blob"
            checked={debugOptions.blob}
          />
          Render heatmap layer with blob style
        </label>
        <p>
          Use a smoother rendering style. Only works when a single fishing layer is shown. Will
          disbale interaction on this layer
        </p>
      </div>
    </div>
  )
}

export default DebugMenu
