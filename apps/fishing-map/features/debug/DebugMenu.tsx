import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { InputText, Switch } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { debugDatasetsInDataviews, debugRelatedDatasets } from 'features/datasets/datasets.debug'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { selectAllDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { selectIsGFWDeveloper, selectIsGFWTestGroup } from 'features/user/selectors/user.selectors'
import { selectIsTurningTidesWorkspace } from 'features/workspace/workspace.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { selectLocationQuery, selectVesselsMaxTimeGapHours } from 'routes/routes.selectors'

import {
  DebugOption,
  FeatureFlag,
  selectDebugOptions,
  selectFeatureFlags,
  setDebugOption,
  toggleDebugOption,
  toggleFeatureFlag,
} from './debug.slice'

import styles from './DebugMenu.module.css'

const DebugMenu: React.FC = () => {
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const isGFWDeveloper = useSelector(selectIsGFWDeveloper)
  const isGFWTestGroup = useSelector(selectIsGFWTestGroup)
  const debugOptions = useSelector(selectDebugOptions)
  const featureFlags = useSelector(selectFeatureFlags)
  const locationQuery = useSelector(selectLocationQuery)
  const vesselsMaxTimeGapHours = useSelector(selectVesselsMaxTimeGapHours)
  const isTurningTidesWorkspace = useSelector(selectIsTurningTidesWorkspace)
  const [datasetId, setDatasetId] = useState<string>('')
  const dataviews = useSelector(selectAllDataviewInstancesResolved) as UrlDataviewInstance[]
  const datasets = useSelector(selectAllDatasets)

  useEffect(() => {
    if (datasetId?.length > 4) {
      debugDatasetsInDataviews(dataviews, datasetId)
      debugRelatedDatasets(datasets, datasetId)
    }
  }, [datasetId])

  return (
    <div className={styles.row}>
      <section className={styles.section}>
        <div className={styles.header}>
          <Switch
            id="option_map_stats"
            active={debugOptions.mapStats}
            onClick={() => dispatch(toggleDebugOption(DebugOption.MapStats))}
          />
          <label htmlFor="option_map_stats">Map stats</label>
        </div>
        <p>Show fps and memory stats</p>
        <div className={styles.header}>
          <Switch
            id="option_debug"
            active={debugOptions.debug}
            onClick={() => dispatch(toggleDebugOption(DebugOption.Debug))}
          />
          <label htmlFor="option_debug">Debug tiles</label>
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
              if (debugOptions.vesselsAsPositions) {
                dispatch(
                  setDebugOption({ option: DebugOption.VesselsMaxTimeGapHours, value: false })
                )
              }
            }}
          />
          <label htmlFor="option_vessels_as_positions">Tracks positions</label>
        </div>
        <p>Show vessel position icons on top of the track lines</p>
        <div className={styles.header}>
          <Switch
            id="option_vessels_max_time_gap_hours"
            active={debugOptions.vesselsMaxTimeGapHours}
            onClick={() => {
              dispatch(toggleDebugOption(DebugOption.VesselsMaxTimeGapHours))
              if (debugOptions.vesselsMaxTimeGapHours) {
                dispatchQueryParams({ vesselsMaxTimeGapHours: undefined })
              } else {
                dispatch(setDebugOption({ option: DebugOption.VesselsAsPositions, value: true }))
                dispatchQueryParams({ vesselsMaxTimeGapHours: 3 })
              }
            }}
          />
          <label htmlFor="option_vessels_max_time_gap_hours">Vessels max time gap hours</label>
          {debugOptions.vesselsMaxTimeGapHours && (
            <InputText
              type="number"
              min={0}
              max={24}
              value={vesselsMaxTimeGapHours}
              className={cx(styles.inputShort, styles.input)}
              onChange={(e) => {
                const value = Number(e.target.value)
                // Validate input: must be a valid number between 0 and 24
                if (!isNaN(value) && value >= 0 && value <= 24) {
                  dispatchQueryParams({ vesselsMaxTimeGapHours: value })
                }
              }}
            />
          )}
        </div>
        <p>Split tracks into segments with a maximum time gap in hours</p>
        <div className={styles.header}>
          <Switch
            id="option_blue_planet_mode"
            active={debugOptions.bluePlanetMode}
            onClick={() => {
              dispatch(toggleDebugOption(DebugOption.BluePlanetMode))
              if (!debugOptions.bluePlanetMode) {
                dispatch(setDebugOption({ option: DebugOption.VesselsAsPositions, value: true }))
              }
            }}
          />
          <label htmlFor="option_blue_planet_mode">Blue planet mode</label>
        </div>
        <p>
          Set the workspace to blue planet mode with the following features:
          <ul>
            <li>
              see gaps icons into the map (only in this{' '}
              <a href="https://globalfishingwatch.org/map/fishing-activity/blue_testing_ja-public">
                workspace
              </a>
              )
            </li>
            <li>blur vessel names in the sidebar and remove from map tooltips</li>
            <li>remove year data from timebar and tooltip</li>
            <li>remove unmatched detections label in tooltip</li>
          </ul>
        </p>
        {isGFWDeveloper && (
          <Fragment>
            <div className={styles.header}>
              <Switch
                id="option_others_reports"
                active={featureFlags.othersReport}
                onClick={() => dispatch(toggleFeatureFlag(FeatureFlag.OthersReport))}
              />
              <label htmlFor="option_others_reports">
                <strong>Feature flag:</strong> Others reports
              </label>
            </div>
            <p>Activates the context points reports feature</p>
            <div className={styles.header}>
              <Switch
                id="option_data_terminology_iframe"
                active={debugOptions.dataTerminologyIframe}
                onClick={() => dispatch(toggleDebugOption(DebugOption.DataTerminologyIframe))}
              />
              <label htmlFor="option_data_terminology_iframe">
                <strong>Feature flag:</strong> Data terminology iframe
              </label>
            </div>
            <p>Activates the data terminology iframe feature</p>
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
            <div className={styles.header}>
              <Switch
                id="dataset_relationship"
                active={debugOptions.datasetRelationship}
                onClick={() => dispatch(toggleDebugOption(DebugOption.DatasetRelationship))}
              />
              <label htmlFor="dataset_relationship">Debug dataset relationship</label>
              {debugOptions.datasetRelationship && (
                <InputText
                  className={styles.input}
                  value={datasetId}
                  inputSize="small"
                  onChange={(e) => setDatasetId(e.target.value)}
                />
              )}
            </div>
            <p>
              Type the dataset id you want to debug why it is loaded in the workspace and check the
              console log
            </p>
            <div className={styles.header}>
              <Switch
                id="option_disable_dataset_hash"
                active={debugOptions.addDatasetIdHash}
                onClick={() => dispatch(toggleDebugOption(DebugOption.DatasetIdHash))}
              />
              <label htmlFor="option_disable_dataset_hash">Include dataset hash in IDs</label>
            </div>
            <p>Dataset IDs includes a hash suffix. Disable to use cleaner IDs without hashes.</p>
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
    </div>
  )
}

export default DebugMenu
