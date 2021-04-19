import React, { Fragment, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Radio from '@globalfishingwatch/ui-components/dist/radio'
import Select, { SelectOption } from '@globalfishingwatch/ui-components/dist/select'
import useClickedOutside from 'hooks/use-clicked-outside'
import { TimebarEvents, TimebarGraphs, TimebarVisualisations } from 'types'
import {
  selectActiveActivityDataviews,
  selectActiveVesselsDataviews,
} from 'features/dataviews/dataviews.selectors'
import { TIMEBAR_EVENT_OPTIONS, TIMEBAR_GRAPH_OPTIONS } from 'data/config'
import { selectTimebarEvents, selectTimebarGraph } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { useTimebarVisualisation } from './timebar.hooks'
import styles from './TimebarSettings.module.css'

const TimebarSettings = () => {
  const { t } = useTranslation()
  const [optionsPanelOpen, setOptionsPanelOpen] = useState(false)
  const activeHeatmapDataviews = useSelector(selectActiveActivityDataviews)
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

  const timebarGraphEnabled = activeVesselDataviews && activeVesselDataviews?.length <= 2
  return (
    <div className={cx('print-hidden', styles.container)} ref={expandedContainerRef}>
      <IconButton
        icon={optionsPanelOpen ? 'close' : 'settings'}
        type="map-tool"
        onClick={optionsPanelOpen ? closeOptions : openOptions}
        tooltip={
          optionsPanelOpen
            ? t('timebarSettings.settings_close', 'Close timebar settings')
            : t('timebarSettings.settings_open', 'Open timebar settings')
        }
      />
      {optionsPanelOpen && (
        <div className={styles.optionsContainer}>
          <Radio
            label={t('common.apparentFishing', 'Apparent Fishing Effort')}
            active={timebarVisualisation === TimebarVisualisations.Heatmap}
            disabled={!activeHeatmapDataviews?.length}
            tooltip={
              !activeHeatmapDataviews?.length
                ? t(
                    'timebarSettings.fishingEffortDisabled',
                    'Select at least one apparent fishing effort layer'
                  )
                : t('timebarSettings.showFishingEffort', 'Show fishing hours graph')
            }
            onClick={setHeatmapActive}
          />
          <Fragment>
            <Radio
              label={t('vessel.tracks', 'Vessel Tracks')}
              active={timebarVisualisation === TimebarVisualisations.Vessel}
              disabled={!activeVesselDataviews?.length}
              tooltip={
                !activeVesselDataviews?.length
                  ? t('timebarSettings.tracksDisabled', 'Select at least one vessel')
                  : t('timebarSettings.showTracks', 'Show tracks graph')
              }
              onClick={setVesselActive}
            />
            {timebarVisualisation === TimebarVisualisations.Vessel &&
              activeVesselDataviews &&
              activeVesselDataviews.length > 0 && (
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
                      label={t('timebarSettings.graph', 'Graph')}
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
        </div>
      )}
    </div>
  )
}

export default TimebarSettings
