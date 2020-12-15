import React, { Fragment, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton, Radio, Select, SelectOption } from '@globalfishingwatch/ui-components/dist'
import useClickedOutside from 'hooks/use-clicked-outside'
import { TimebarEvents, TimebarGraphs, TimebarVisualisations } from 'types'
import {
  selectActiveTemporalgridDataviews,
  selectActiveVesselsDataviews,
} from 'features/workspace/workspace.selectors'
import { TIMEBAR_EVENT_OPTIONS, TIMEBAR_GRAPH_OPTIONS } from 'data/config'
import { selectTimebarEvents, selectTimebarGraph } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { useTimebarVisualisation } from './timebar.hooks'
import styles from './TimebarSettings.module.css'

const TimebarSettings = () => {
  const { t } = useTranslation()
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
    if (!o.label.includes('Coming soon')) {
      dispatchQueryParams({ timebarGraph: o.id as TimebarGraphs })
    }
  }
  const removeEventsOption = () => {
    dispatchQueryParams({ timebarEvents: TimebarEvents.None })
  }
  const removeGraphOption = () => {
    dispatchQueryParams({ timebarGraph: TimebarGraphs.None })
  }
  const expandedContainerRef = useClickedOutside(closeOptions)

  if (!timebarVisualisation) return null

  const timebarGraphEnabled = activeVesselDataviews && activeVesselDataviews?.length <= 2
  return (
    <div className={cx('print-hidden', styles.container)} ref={expandedContainerRef}>
      <IconButton
        icon={optionsPanelOpen ? 'close' : 'settings'}
        type="map-tool"
        onClick={optionsPanelOpen ? closeOptions : openOptions}
        tooltip={
          optionsPanelOpen
            ? t('timebar.settings_close', 'Close timebar settings')
            : t('timebar.settings_open', 'Open timebar settings')
        }
      />
      {optionsPanelOpen && (
        <div className={styles.optionsContainer}>
          {activeHeatmapDataviews && activeHeatmapDataviews.length > 0 && (
            <Radio
              label={t('common.apparentFishing', 'Apparent Fishing Effort')}
              active={timebarVisualisation === TimebarVisualisations.Heatmap}
              onClick={setHeatmapActive}
            />
          )}
          {activeVesselDataviews && activeVesselDataviews.length > 0 && (
            <Fragment>
              <Radio
                label={t('vessel.tracks', 'Vessel Tracks')}
                active={timebarVisualisation === TimebarVisualisations.Vessel}
                onClick={setVesselActive}
              />
              {timebarVisualisation === TimebarVisualisations.Vessel && (
                <div className={styles.vesselTrackOptions}>
                  <Select
                    // label={t('common.events', 'Events')}
                    label="Events (Coming soon)"
                    options={TIMEBAR_EVENT_OPTIONS}
                    selectedOption={TIMEBAR_EVENT_OPTIONS.find((o) => o.id === timebarEvents)}
                    onSelect={setEventsOption}
                    onRemove={removeEventsOption}
                    direction="top"
                    disabled
                  />
                  {timebarGraphEnabled && (
                    <Select
                      label={t('timebar.graph', 'Graph')}
                      options={TIMEBAR_GRAPH_OPTIONS}
                      selectedOption={TIMEBAR_GRAPH_OPTIONS.find((o) => o.id === timebarGraph)}
                      onSelect={setGraphOption}
                      onRemove={removeGraphOption}
                      direction="top"
                    />
                  )}
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
