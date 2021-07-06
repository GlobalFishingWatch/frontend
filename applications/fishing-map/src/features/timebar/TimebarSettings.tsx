import React, { Fragment, useMemo, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Radio from '@globalfishingwatch/ui-components/dist/radio'
import Select, { SelectOption } from '@globalfishingwatch/ui-components/dist/select'
import useClickedOutside from 'hooks/use-clicked-outside'
import { TimebarEvents, TimebarGraphs, TimebarVisualisations } from 'types'
import {
  selectActiveActivityDataviews,
  selectActiveTrackDataviews,
  selectActiveVesselsDataviews,
} from 'features/dataviews/dataviews.selectors'
import { selectTimebarEvents, selectTimebarGraph } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { getEventLabel } from 'utils/analytics'
import { useTimebarVisualisation } from './timebar.hooks'
import styles from './TimebarSettings.module.css'

const TimebarSettings = () => {
  const { t } = useTranslation()
  const [optionsPanelOpen, setOptionsPanelOpen] = useState(false)
  const activeHeatmapDataviews = useSelector(selectActiveActivityDataviews)
  const activeTrackDataviews = useSelector(selectActiveTrackDataviews)
  const activeVesselsDataviews = useSelector(selectActiveVesselsDataviews)
  const timebarEvents = useSelector(selectTimebarEvents)
  const timebarGraph = useSelector(selectTimebarGraph)
  const { dispatchQueryParams } = useLocationConnect()
  const { timebarVisualisation, dispatchTimebarVisualisation } = useTimebarVisualisation()

  const TIMEBAR_GRAPH_OPTIONS: SelectOption[] = useMemo(
    () => [
      {
        id: 'speed',
        label: t('timebarSettings.graphOptions.speed', 'Speed'),
      },
      {
        id: 'depth',
        label: t('timebarSettings.graphOptions.depth', 'Depth (Coming soon)'),
        disabled: true,
      },
      {
        id: 'none',
        label: t('timebarSettings.graphOptions.none', 'None'),
      },
    ],
    [t]
  )
  const TIMEBAR_EVENT_OPTIONS: SelectOption<TimebarEvents>[] = useMemo(
    () => [
      {
        id: 'all',
        label: t('timebarSettings.eventOptions.all', 'All events'),
      },
      {
        id: 'fishing',
        label: t('timebarSettings.eventOptions.fishing', 'Fishing'),
      },
      {
        id: 'loitering',
        label: t('timebarSettings.eventOptions.loitering', 'Loitering'),
      },
      {
        id: 'none',
        label: t('timebarSettings.eventOptions.none', 'None'),
      },
      {
        id: 'encounter',
        label: `${t('timebarSettings.eventOptions.encounters', 'Encounters')} (${t(
          'common.comingSoon',
          'Coming soon'
        )})`,
        disabled: true,
      },
      {
        id: 'port',
        label: `${t('timebarSettings.eventOptions.ports', 'Port visits')} (${t(
          'common.comingSoon',
          'Coming soon'
        )})`,
        disabled: true,
      },
    ],
    [t]
  )

  const openOptions = () => {
    uaEvent({
      category: 'Timebar',
      action: 'Open timebar settings',
      label: getEventLabel([`visualization: ${timebarVisualisation}`]),
    })
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
    dispatchQueryParams({ timebarEvents: 'none' })
  }
  const removeGraphOption = () => {
    dispatchQueryParams({ timebarGraph: TimebarGraphs.None })
  }
  const expandedContainerRef = useClickedOutside(closeOptions)

  const timebarGraphEnabled = activeVesselsDataviews && activeVesselsDataviews?.length <= 2
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
              label={t('timebarSettings.tracks', 'Tracks')}
              active={timebarVisualisation === TimebarVisualisations.Vessel}
              disabled={!activeTrackDataviews?.length}
              tooltip={
                !activeTrackDataviews?.length
                  ? t('timebarSettings.tracksDisabled', 'Select at least one vessel')
                  : t('timebarSettings.showTracks', 'Show tracks graph')
              }
              onClick={setVesselActive}
            />
            {timebarVisualisation === TimebarVisualisations.Vessel &&
              activeVesselsDataviews &&
              activeVesselsDataviews.length > 0 && (
                <div className={styles.vesselTrackOptions}>
                  <Select
                    label={t('common.events', 'Events')}
                    options={TIMEBAR_EVENT_OPTIONS}
                    selectedOption={TIMEBAR_EVENT_OPTIONS.find((o) => o.id === timebarEvents)}
                    onSelect={setEventsOption}
                    onRemove={removeEventsOption}
                    direction="top"
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
