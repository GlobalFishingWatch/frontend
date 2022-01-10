import React, { useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import { IconButton, Radio } from '@globalfishingwatch/ui-components'
import useClickedOutside from 'hooks/use-clicked-outside'
import { TimebarGraphs, TimebarVisualisations } from 'types'
import { selectActiveActivityDataviews } from 'features/dataviews/dataviews.selectors'
import { selectActivityCategory } from 'features/app/app.selectors'
import { getEventLabel } from 'utils/analytics'
import {
  selectActiveTrackDataviews,
  selectActiveVesselsDataviews,
} from 'features/dataviews/dataviews.slice'
import { useTimebarVisualisationConnect, useTimebarGraphConnect } from './timebar.hooks'
import styles from './TimebarSettings.module.css'

const TimebarSettings = () => {
  const { t } = useTranslation()
  const [optionsPanelOpen, setOptionsPanelOpen] = useState(false)
  const activeHeatmapDataviews = useSelector(selectActiveActivityDataviews)
  const activeTrackDataviews = useSelector(selectActiveTrackDataviews)
  const activeVesselsDataviews = useSelector(selectActiveVesselsDataviews)
  const { timebarVisualisation, dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const { timebarGraph, dispatchTimebarGraph } = useTimebarGraphConnect()
  const activityCategory = useSelector(selectActivityCategory)
  const timebarGraphEnabled = activeVesselsDataviews && activeVesselsDataviews.length <= 2

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
    dispatchTimebarGraph(TimebarGraphs.None)
  }
  const setVesselGraphSpeed = () => {
    dispatchTimebarVisualisation(TimebarVisualisations.Vessel)
    dispatchTimebarGraph(TimebarGraphs.Speed)
  }
  const setVesselGraphDepth = () => {
    dispatchTimebarVisualisation(TimebarVisualisations.Vessel)
    dispatchTimebarGraph(TimebarGraphs.Depth)
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
        onClick={optionsPanelOpen ? closeOptions : openOptions}
        tooltip={
          optionsPanelOpen
            ? t('timebarSettings.settings_close', 'Close timebar settings')
            : t('timebarSettings.settings_open', 'Open timebar settings')
        }
      />
      {optionsPanelOpen && (
        <div className={styles.optionsContainer}>
          <h1>Timebar settings</h1>
          <div className={styles.radiosContainer}>
            <Radio
              label={activityLabel}
              active={timebarVisualisation === TimebarVisualisations.Heatmap}
              disabled={!activeHeatmapDataviews?.length}
              tooltip={activityTooltipLabel}
              onClick={setHeatmapActive}
            />
            <Radio
              label={t('timebarSettings.tracks', 'Tracks')}
              active={
                timebarVisualisation === TimebarVisualisations.Vessel &&
                (timebarGraph === TimebarGraphs.None || !timebarGraphEnabled)
              }
              disabled={!activeTrackDataviews?.length}
              tooltip={
                !activeTrackDataviews?.length
                  ? t('timebarSettings.tracksDisabled', 'Select at least one vessel')
                  : t('timebarSettings.showTracks', 'Show tracks graph')
              }
              onClick={setVesselActive}
            />
            <Radio
              label={t('timebarSettings.graphSpeed', 'Track Speed')}
              active={
                timebarVisualisation === TimebarVisualisations.Vessel &&
                timebarGraph === TimebarGraphs.Speed &&
                timebarGraphEnabled
              }
              disabled={!activeTrackDataviews?.length || !timebarGraphEnabled}
              tooltip={
                !activeTrackDataviews?.length || !timebarGraphEnabled
                  ? t(
                      'timebarSettings.graphDisabled',
                      'Not available with more than 2 vessels selected'
                    )
                  : t('timebarSettings.showGraphSpeed', 'Show track speed graph')
              }
              onClick={setVesselGraphSpeed}
            />
            <Radio
              label={t('timebarSettings.graphDepth', 'Track Depth')}
              active={
                timebarVisualisation === TimebarVisualisations.Vessel &&
                timebarGraph === TimebarGraphs.Depth &&
                timebarGraphEnabled
              }
              disabled={!activeTrackDataviews?.length || !timebarGraphEnabled}
              tooltip={
                !activeTrackDataviews?.length || !timebarGraphEnabled
                  ? t(
                      'timebarSettings.graphDisabled',
                      'Not available with more than 2 vessels selected'
                    )
                  : t('timebarSettings.showGraphDepth', 'Show track depth graph')
              }
              onClick={setVesselGraphDepth}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TimebarSettings
