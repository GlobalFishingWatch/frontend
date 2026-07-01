import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { InputText, Switch } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectIsGFWDeveloper, selectIsGFWTestGroup } from 'features/user/selectors/user.selectors'
import { selectIsTurningTidesWorkspace } from 'features/workspace/workspace.selectors'
import { useReplaceQueryParams } from 'router/routes.hook'

import {
  DebugOption,
  FAKE_VESSEL_NAME,
  FeatureFlag,
  selectDebugOptions,
  selectFeatureFlags,
  setDebugOption,
  toggleDebugOption,
  toggleFeatureFlag,
} from './debug.slice'

import styles from './DebugMenu.module.css'

const DebugFeatureFlags: React.FC = () => {
  const dispatch = useAppDispatch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const isGFWDeveloper = useSelector(selectIsGFWDeveloper)
  const isGFWTestGroup = useSelector(selectIsGFWTestGroup)
  const debugOptions = useSelector(selectDebugOptions)
  const featureFlags = useSelector(selectFeatureFlags)
  const isTurningTidesWorkspace = useSelector(selectIsTurningTidesWorkspace)

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <Switch
          id="option_map_stats"
          active={debugOptions.deckStats}
          onClick={() => dispatch(toggleDebugOption(DebugOption.DeckStats))}
        />
        <label htmlFor="option_map_stats">Deck.gl stats (map and timebar)</label>
      </div>
      <p>Show fps and memory stats</p>
      <div className={styles.header}>
        <Switch
          id="option_debug_tiles"
          active={debugOptions.debugTiles}
          onClick={() => dispatch(toggleDebugOption(DebugOption.DebugTiles))}
        />
        <label htmlFor="option_debug_tiles">Debug tiles</label>
      </div>
      <p>Displays info on tiles useful for debugging.</p>
      <div className={styles.header}>
        <Switch
          id="option_thinning"
          active={isTurningTidesWorkspace ? false : debugOptions.thinning}
          disabled={isTurningTidesWorkspace}
          onClick={() => dispatch(toggleDebugOption(DebugOption.Thinning))}
        />
        <label htmlFor="option_thinning">Track thinning</label>
      </div>
      <p>Don't send any thinning param to tracks API to debug original resolution</p>
      <div className={styles.header}>
        <Switch
          id="option_vessels_as_positions"
          active={debugOptions.vesselsAsPositions}
          onClick={() => {
            dispatch(toggleDebugOption(DebugOption.VesselsAsPositions))
          }}
        />
        <label htmlFor="option_vessels_as_positions">Tracks positions</label>
      </div>
      <p>Show vessel position icons on top of the track lines</p>
      <div className={styles.header}>
        <Switch
          id="option_hide_vessel_names"
          active={debugOptions.hideVesselNames}
          onClick={() => {
            dispatch(toggleDebugOption(DebugOption.HideVesselNames))
          }}
        />
        <label htmlFor="option_hide_vessel_names">Fake vessel names</label>
      </div>
      <p>
        Replace vessel names with {FAKE_VESSEL_NAME} in the sidebar and remove from map tooltips.
      </p>
      <div className={styles.header}>
        <Switch
          id="option_vessels_max_time_gap_hours"
          active={debugOptions.vesselGapsThresholdFilter}
          onClick={() => {
            dispatch(toggleDebugOption(DebugOption.VesselGapsThresholdFilter))
          }}
        />
        <label htmlFor="option_vessels_max_time_gap_hours">Show vessel gaps threshold filter</label>
      </div>
      <p>Show the gaps threshold filter by hours in the vessel layer filters</p>
      <div className={styles.header}>
        <Switch
          id="option_disable_dataset_hash"
          active={debugOptions.addDatasetIdHash}
          onClick={() => dispatch(toggleDebugOption(DebugOption.DatasetIdHash))}
        />
        <label htmlFor="option_disable_dataset_hash">Include dataset hash in IDs</label>
      </div>
      <p>Dataset IDs includes a hash suffix. Disable to use cleaner IDs without hashes.</p>
      {isGFWDeveloper && (
        <Fragment>
          <div className={styles.header}>
            <Switch
              id="option_polygons_report"
              active={featureFlags.polygonsReport}
              onClick={() => dispatch(toggleFeatureFlag(FeatureFlag.PolygonsReport))}
            />
            <label htmlFor="option_polygons_report">
              <strong>Feature flag:</strong> Polygons report
            </label>
          </div>
          <p>See reports of polygon areas</p>
          <div className={styles.header}>
            <Switch
              id="option_report_preview"
              active={featureFlags.reportPreview}
              onClick={() => dispatch(toggleFeatureFlag(FeatureFlag.ReportPreview))}
            />
            <label htmlFor="option_report_preview">
              <strong>Feature flag:</strong> Report preview
            </label>
          </div>
          <p>Show an area report sparkline preview in context layer popups</p>
          <div className={styles.header}>
            <Switch
              id="option_hotspot_button"
              active={featureFlags.hotspotButton}
              onClick={() => dispatch(toggleFeatureFlag(FeatureFlag.HotspotButton))}
            />
            <label htmlFor="option_hotspot_button">
              <strong>Feature flag:</strong> Hotspot zone button
            </label>
          </div>
          <p>Show the hotspot zone button in the report activity graph</p>
          <div className={styles.header}>
            <Switch
              id="option_areas_on_screen"
              active={debugOptions.areasOnScreen}
              onClick={() => dispatch(toggleDebugOption(DebugOption.AreasOnScreen))}
            />
            <label htmlFor="option_areas_on_screen">
              <strong>Feature flag:</strong> Areas on screen
            </label>
          </div>
          <p>Activates the "Areas on screen" selector in context layers</p>
          {isGFWTestGroup && (
            <Fragment>
              <div className={styles.header}>
                <Switch
                  id="option_currents_layer"
                  active={debugOptions.experimentalLayers}
                  onClick={() => dispatch(toggleDebugOption(DebugOption.ExperimentalLayers))}
                />
                <label htmlFor="option_currents_layer">Experimental layers</label>
              </div>
              <p>Make experimental layers available in layer library</p>
            </Fragment>
          )}
        </Fragment>
      )}
    </section>
  )
}

export default DebugFeatureFlags
