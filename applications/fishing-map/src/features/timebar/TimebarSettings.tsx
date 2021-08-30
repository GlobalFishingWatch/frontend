import React, { Fragment, useMemo, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Radio from '@globalfishingwatch/ui-components/dist/radio'
import Select, { SelectOption } from '@globalfishingwatch/ui-components/dist/select'
import useClickedOutside from 'hooks/use-clicked-outside'
import { TimebarGraphs, TimebarVisualisations } from 'types'
import {
  selectActiveActivityDataviews,
  selectActiveTrackDataviews,
  selectActiveVesselsDataviews,
} from 'features/dataviews/dataviews.selectors'
import { selectActivityCategory, selectTimebarGraph } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { getEventLabel } from 'utils/analytics'
import { useTimebarVisualisationConnect } from './timebar.hooks'
import { selectTracksGraphsLoading } from './timebar.selectors'
import styles from './TimebarSettings.module.css'

const TimebarSettings = () => {
  const { t } = useTranslation()
  const [optionsPanelOpen, setOptionsPanelOpen] = useState(false)
  const activeHeatmapDataviews = useSelector(selectActiveActivityDataviews)
  const activeTrackDataviews = useSelector(selectActiveTrackDataviews)
  const activeVesselsDataviews = useSelector(selectActiveVesselsDataviews)
  const timebarGraph = useSelector(selectTimebarGraph)
  const { dispatchQueryParams } = useLocationConnect()
  const { timebarVisualisation, dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const activityCategory = useSelector(selectActivityCategory)
  const graphsLoading = useSelector(selectTracksGraphsLoading)
  const timebarGraphEnabled = activeVesselsDataviews && activeVesselsDataviews.length < 2

  const TIMEBAR_GRAPH_OPTIONS: SelectOption[] = useMemo(
    () => [
      {
        id: 'speed',
        label: t('timebarSettings.graphOptions.speed', 'Speed'),
        tooltip: timebarGraphEnabled
          ? ''
          : t(
              'timebarSettings.graphOptions.speedDisabled',
              'Not available with more than 1 vessel selected'
            ),
        disabled: !timebarGraphEnabled,
      },
      {
        id: 'depth',
        label: t('timebarSettings.graphOptions.depth', 'Depth (Coming soon)'),
        tooltip: t('common.comingSoon', 'Coming soon'),
        disabled: true,
      },
      {
        id: 'none',
        label: t('timebarSettings.graphOptions.none', 'None'),
      },
    ],
    [timebarGraphEnabled, t]
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
  const setGraphOption = (o: SelectOption) => {
    if (!o.label.includes('Coming soon')) {
      dispatchQueryParams({ timebarGraph: o.id as TimebarGraphs })
    }
  }
  const removeGraphOption = () => {
    dispatchQueryParams({ timebarGraph: TimebarGraphs.None })
  }
  const expandedContainerRef = useClickedOutside(closeOptions)

  const activityLabel = `
    ${t('common.activity', 'Activity')} - ${
    activityCategory === 'fishing'
      ? t('common.fishing', 'Fishing')
      : t('common.presence', 'Presence')
  }
  `

  const activityTooltipLabel = !activeHeatmapDataviews?.length
    ? activityCategory === 'fishing'
      ? t(
          'timebarSettings.fishingEffortDisabled',
          'Select at least one apparent fishing effort layer'
        )
      : t('timebarSettings.presenceDisabled', 'Select at least one presence layer')
    : activityCategory === 'fishing'
    ? t('timebarSettings.showFishingEffort', 'Show fishing hours graph')
    : t('timebarSettings.showPresence', 'Show presence graph')

  return (
    <div className={cx('print-hidden', styles.container)} ref={expandedContainerRef}>
      <IconButton
        icon={optionsPanelOpen ? 'close' : 'settings'}
        type="map-tool"
        loading={graphsLoading}
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
            label={activityLabel}
            active={timebarVisualisation === TimebarVisualisations.Heatmap}
            disabled={!activeHeatmapDataviews?.length}
            tooltip={activityTooltipLabel}
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
