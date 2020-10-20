import React, { Fragment, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import useClickedOutside from 'hooks/useClickedOutside'
import { TimebarEvents, TimebarGraphs } from 'types'
import { IconButton, Radio, Select, SelectOption } from '@globalfishingwatch/ui-components/dist'
import {
  selectActiveTemporalgridDataviews,
  selectActiveVesselsDataviews,
} from 'features/workspace/workspace.selectors'
import { timebarEventsOptions, timebarGraphOptions } from 'data/config'
import { selectTimebarEvents, selectTimebarGraph } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { useTimebarVisualisation } from './timebar.hooks'
import styles from './TimebarSettings.module.css'

const TimebarSettings = () => {
  const [optionsPanelOpen, setOptionsPanelOpen] = useState(false)
  const activeHeatmapDataviews = useSelector(selectActiveTemporalgridDataviews)
  const activeVesselDataviews = useSelector(selectActiveVesselsDataviews)
  const timebarEvents = useSelector(selectTimebarEvents)
  const timebarGraph = useSelector(selectTimebarGraph)
  const { dispatchQueryParams } = useLocationConnect()
  const { timebarVisualisation, dispatchTimebarVisualisation } = useTimebarVisualisation()

  const openOptions = () => {
    setOptionsPanelOpen(true)
  }
  const closeOptions = () => {
    setOptionsPanelOpen(false)
  }
  const setHeatmapActive = () => {
    dispatchTimebarVisualisation('heatmap')
  }
  const setVesselActive = () => {
    dispatchTimebarVisualisation('vessel')
  }
  const setEventsOption = (o: SelectOption) => {
    dispatchQueryParams({ timebarEvents: o.id as TimebarEvents })
  }
  const setGraphOption = (o: SelectOption) => {
    dispatchQueryParams({ timebarGraph: o.id as TimebarGraphs })
  }
  const removeEventsOption = () => {
    dispatchQueryParams({ timebarEvents: 'none' })
  }
  const removeGraphOption = () => {
    dispatchQueryParams({ timebarGraph: 'none' })
  }
  const expandedContainerRef = useClickedOutside(closeOptions)

  if (activeVesselDataviews?.length === 0) return null
  return (
    <div className={styles.container} ref={expandedContainerRef}>
      <IconButton
        icon={optionsPanelOpen ? 'close' : 'settings'}
        type="map-tool"
        onClick={optionsPanelOpen ? closeOptions : openOptions}
      />
      {optionsPanelOpen && (
        <div className={styles.optionsContainer}>
          {activeHeatmapDataviews && activeHeatmapDataviews.length > 0 && (
            <div>
              <Radio active={timebarVisualisation === 'heatmap'} onClick={setHeatmapActive} />
              <span
                className={cx(styles.option, {
                  [styles.active]: timebarVisualisation === 'heatmap',
                })}
                onClick={setHeatmapActive}
              >
                Apparent Fishing Effort
              </span>
            </div>
          )}
          {activeVesselDataviews && activeVesselDataviews.length > 0 && (
            <Fragment>
              <div>
                <Radio active={timebarVisualisation === 'vessel'} onClick={setVesselActive} />
                <span
                  className={cx(styles.option, {
                    [styles.active]: timebarVisualisation === 'vessel',
                  })}
                  onClick={setVesselActive}
                >
                  Vessel Tracks
                </span>
              </div>
              {timebarVisualisation === 'vessel' && (
                <div className={styles.vesselTrackOptions}>
                  <Select
                    label="Events"
                    options={timebarEventsOptions}
                    selectedOption={timebarEventsOptions.find((o) => o.id === timebarEvents)}
                    onSelect={setEventsOption}
                    onRemove={removeEventsOption}
                    direction="top"
                  />
                  <Select
                    label="Graph"
                    options={timebarGraphOptions}
                    selectedOption={timebarGraphOptions.find((o) => o.id === timebarGraph)}
                    onSelect={setGraphOption}
                    onRemove={removeGraphOption}
                    direction="top"
                  />
                </div>
              )}
            </Fragment>
          )}
        </div>
      )}
    </div>
  )
}

export default TimebarSettings
