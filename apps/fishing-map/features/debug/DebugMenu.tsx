import { useSelector } from 'react-redux'
import { Switch } from '@globalfishingwatch/ui-components'
import { selectLocationQuery } from 'routes/routes.selectors'
import { useMapStyle } from 'features/map/map-style.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { DebugOption, selectDebugOptions, toggleOption } from './debug.slice'
import styles from './DebugMenu.module.css'

const DebugMenu: React.FC = () => {
  const dispatch = useAppDispatch()
  const debugOptions = useSelector(selectDebugOptions)
  const locationQuery = useSelector(selectLocationQuery)
  // Not sure why, but it seems this hook returns an outdated style
  const style = useMapStyle()
  return (
    <div className={styles.row}>
      <section className={styles.section}>
        <div className={styles.header}>
          <Switch
            id="option_blob"
            active={debugOptions.blob}
            onClick={() => dispatch(toggleOption(DebugOption.Blob))}
          />
          <label htmlFor="option_blob">[experimental] Smooth heatmap style</label>
        </div>
        <p>
          Render fishing layer with a smoother rendering style. Only works when a single fishing
          layer is shown. Will disable interaction on this layer.
        </p>
        <div className={styles.header}>
          <Switch
            id="option_extruded"
            active={debugOptions.extruded}
            onClick={() => dispatch(toggleOption(DebugOption.Extruded))}
          />
          <label htmlFor="option_extruded">[experimental] Stacked 3D bars</label>
        </div>
        <p>Renders fishing activity as stacked 3D bars. Will disable interaction on this layer.</p>
        <div className={styles.header}>
          <Switch
            id="option_debug"
            active={debugOptions.debug}
            onClick={() => dispatch(toggleOption(DebugOption.Debug))}
          />
          <label htmlFor="option_debug">Debug tiles</label>
        </div>
        <p>Displays info on tiles useful for debugging.</p>
        <div className={styles.header}>
          <Switch
            id="option_thinning"
            active={debugOptions.thinning}
            onClick={() => dispatch(toggleOption(DebugOption.Thinning))}
          />
          <label htmlFor="option_thinning">Track thinning</label>
        </div>
        <p>Don't send any thinning param to tracks API to debug original resolution</p>
      </section>
      <hr className={styles.separation} />
      <section>
        <div className={styles.header}>
          <label>Current URL workspace settings</label>
        </div>
        <textarea
          className={styles.editor}
          defaultValue={JSON.stringify(locationQuery, undefined, 2)}
        />
      </section>
      <hr className={styles.separation} />
      <section>
        <div className={styles.header}>
          <label>Current map GL style</label>
        </div>
        <textarea className={styles.editor} defaultValue={JSON.stringify(style, undefined, 2)} />
      </section>
    </div>
  )
}

export default DebugMenu
