import React, { Fragment, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import useClickedOutside from 'hooks/useClickedOutside'
import { TimebarEvents, TimebarGraphs, TimebarVisualisations } from 'types'
import { IconButton, Radio, Select, SelectOption } from '@globalfishingwatch/ui-components/dist'
import {
  selectActiveTemporalgridDataviews,
  selectActiveVesselsDataviews,
} from 'features/workspace/workspace.selectors'
import { TIMEBAR_EVENT_OPTIONS, TIMEBAR_GRAPH_OPTIONS } from 'data/config'
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
    dispatchTimebarVisualisation(TimebarVisualisations.Heatmap)
  }
  const setVesselActive = () => {
    dispatchTimebarVisualisation(TimebarVisualisations.Vessel)
  }
  const setEventsOption = (o: SelectOption) => {
    dispatchQueryParams({ timebarEvents: o.id as TimebarEvents })
  }
  const setGraphOption = (o: SelectOption) => {
    dispatchQueryParams({ timebarGraph: o.id as TimebarGraphs })
  }
  const removeEventsOption = () => {
    dispatchQueryParams({ timebarEvents: TimebarEvents.None })
  }
  const removeGraphOption = () => {
    dispatchQueryParams({ timebarGraph: TimebarGraphs.None })
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
                    options={TIMEBAR_EVENT_OPTIONS}
                    selectedOption={TIMEBAR_EVENT_OPTIONS.find((o) => o.id === timebarEvents)}
                    onSelect={setEventsOption}
                    onRemove={removeEventsOption}
                    direction="top"
                  />
                  <Select
                    label="Graph"
                    options={TIMEBAR_GRAPH_OPTIONS}
                    selectedOption={TIMEBAR_GRAPH_OPTIONS.find((o) => o.id === timebarGraph)}
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
