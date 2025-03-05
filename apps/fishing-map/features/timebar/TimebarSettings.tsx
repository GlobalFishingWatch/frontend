import type { ComponentType } from 'react'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { IconButton, Radio } from '@globalfishingwatch/ui-components'

import AreaIcon from 'assets/icons/timebar-area.svg'
import TrackDepthIcon from 'assets/icons/timebar-track-depth.svg'
import TrackSpeedIcon from 'assets/icons/timebar-track-speed.svg'
import TracksIcon from 'assets/icons/timebar-tracks.svg'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import {
  selectActiveActivityDataviews,
  selectActiveDetectionsDataviews,
  selectActiveVesselGroupDataviews,
  selectActiveVesselsDataviews,
} from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectActiveTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectActiveHeatmapEnvironmentalDataviewsWithoutStatic } from 'features/dataviews/selectors/dataviews.selectors'
import useClickedOutside from 'hooks/use-clicked-outside'
import { selectIsVesselLocation } from 'routes/routes.selectors'
import { TimebarGraphs, TimebarVisualisations } from 'types'
import { getEventLabel } from 'utils/analytics'

import {
  useTimebarEnvironmentConnect,
  useTimebarGraphConnect,
  useTimebarVesselGroupConnect,
  useTimebarVisualisationConnect,
} from './timebar.hooks'

import styles from './TimebarSettings.module.css'

const Icon = ({
  SvgIcon,
  label,
  color,
  disabled,
}: {
  SvgIcon: ComponentType
  label: string
  color: string
  disabled?: boolean
}) => {
  const svgProps = {
    fill: color,
    stroke: color,
  }
  return (
    <Fragment>
      <SvgIcon
        className={cx(styles.icon, { [styles.iconDisabled]: disabled })}
        {...(svgProps as any)}
      />
      {label}
    </Fragment>
  )
}

const TimebarSettings = ({ loading = false }: { loading: boolean }) => {
  const { t } = useTranslation()
  const [optionsPanelOpen, setOptionsPanelOpen] = useState(false)
  const activeActivityDataviews = useSelector(selectActiveActivityDataviews)
  const activeDetectionsDataviews = useSelector(selectActiveDetectionsDataviews)
  const activeEnvironmentalDataviews = useSelector(
    selectActiveHeatmapEnvironmentalDataviewsWithoutStatic
  )
  const activeTrackDataviews = useSelector(selectActiveTrackDataviews)
  const activeVesselGroupDataviews = useSelector(selectActiveVesselGroupDataviews)
  const isStandaloneVesselLocation = useSelector(selectIsVesselLocation)
  const activeVesselsDataviews = useSelector(selectActiveVesselsDataviews)
  const hasSomeVesselLayer = activeVesselsDataviews?.length > 0
  const { timebarVisualisation, dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const { timebarSelectedEnvId, dispatchTimebarSelectedEnvId } = useTimebarEnvironmentConnect()
  const { timebarSelectedVGId, dispatchTimebarSelectedVGId } = useTimebarVesselGroupConnect()
  const { timebarGraph, dispatchTimebarGraph } = useTimebarGraphConnect()
  const timebarGraphEnabled = activeVesselsDataviews && activeVesselsDataviews?.length <= 2

  const openOptions = () => {
    trackEvent({
      category: TrackCategory.Timebar,
      action: 'Open timebar settings',
      label: getEventLabel([`visualization: ${timebarVisualisation}`]),
    })
    setOptionsPanelOpen(true)
  }
  const closeOptions = () => {
    setOptionsPanelOpen(false)
  }
  const setHeatmapActivityActive = () => {
    dispatchTimebarVisualisation(TimebarVisualisations.HeatmapActivity)
    trackEvent({
      category: TrackCategory.Timebar,
      action: 'select_timebar_settings',
      label: `${TimebarVisualisations.HeatmapActivity}`,
    })
  }
  const setHeatmapDetectionsActive = () => {
    dispatchTimebarVisualisation(TimebarVisualisations.HeatmapDetections)
    trackEvent({
      category: TrackCategory.Timebar,
      action: 'select_timebar_settings',
      label: `${TimebarVisualisations.HeatmapDetections}`,
    })
  }
  const setEnvironmentActive = (environmentalDataviewId: string) => {
    dispatchTimebarVisualisation(TimebarVisualisations.Environment)
    dispatchTimebarSelectedEnvId(environmentalDataviewId)
    trackEvent({
      category: TrackCategory.Timebar,
      action: 'select_timebar_settings',
      label: `${TimebarVisualisations.Environment} - ${environmentalDataviewId}`,
    })
  }
  const setVesselGroupActive = (vesselGroupDataviewId: string) => {
    dispatchTimebarVisualisation(TimebarVisualisations.VesselGroup)
    dispatchTimebarSelectedVGId(vesselGroupDataviewId)
  }
  const setVesselActive = () => {
    dispatchTimebarVisualisation(TimebarVisualisations.Vessel)
    dispatchTimebarGraph(TimebarGraphs.None)
    trackEvent({
      category: TrackCategory.Timebar,
      action: 'select_timebar_settings',
      label: `${TimebarVisualisations.Vessel} - ${TimebarGraphs.None}`,
    })
  }
  const setVesselGraphSpeed = () => {
    dispatchTimebarVisualisation(TimebarVisualisations.Vessel)
    dispatchTimebarGraph(TimebarGraphs.Speed)
    trackEvent({
      category: TrackCategory.Timebar,
      action: 'select_timebar_settings',
      label: `${TimebarVisualisations.Vessel} - ${TimebarGraphs.Speed}`,
    })
  }
  const setVesselGraphDepth = () => {
    dispatchTimebarVisualisation(TimebarVisualisations.Vessel)
    dispatchTimebarGraph(TimebarGraphs.Depth)
    trackEvent({
      category: TrackCategory.Timebar,
      action: 'select_timebar_settings',
      label: `${TimebarVisualisations.Vessel} - ${TimebarGraphs.Depth}`,
    })
  }

  const getVesselGraphTooltip = (graph: 'speed' | 'depth') => {
    let tooltipLabel =
      graph === 'depth'
        ? t('timebarSettings.showGraphDepth', 'Show track depth graph')
        : t('timebarSettings.showGraphSpeed', 'Show track speed graph')
    if (!activeTrackDataviews?.length) {
      tooltipLabel = t('timebarSettings.tracksDisabled', 'Select at least one vessel')
    } else if (!timebarGraphEnabled) {
      tooltipLabel = t(
        'timebarSettings.graphDisabled',
        'Graph is not available with more than 2 vessels selected'
      )
    } else if (!hasSomeVesselLayer) {
      tooltipLabel = t('timebarSettings.graphVesselOnly', {
        defaultValue: '{{graph}} is only available for vessel tracks',
        graph:
          graph === 'depth'
            ? t(`timebarSettings.graphDepth`, 'Vessel depth')
            : t(`timebarSettings.graphSpeed`, 'Vessel speed'),
      })
    }
    return tooltipLabel
  }

  const expandedContainerRef = useClickedOutside(closeOptions)

  const activityTooltipLabel = !activeActivityDataviews?.length
    ? t('timebarSettings.activityDisabled', 'Select at least one activity layer')
    : t('timebarSettings.showActivity', 'Show activity graph')

  const detectionsTooltipLabel = !activeDetectionsDataviews?.length
    ? t('timebarSettings.detectionsDisabled', 'Select at least one detections layer')
    : t('timebarSettings.showDetections', 'Show detections graph')

  return (
    <div className={cx('print-hidden', styles.container)} ref={expandedContainerRef}>
      <IconButton
        icon={optionsPanelOpen ? 'close' : 'settings'}
        loading={loading}
        type="map-tool"
        onClick={optionsPanelOpen ? closeOptions : openOptions}
        tooltip={
          loading
            ? t('vessel.loadingInfo')
            : optionsPanelOpen
              ? t('timebarSettings.settings_close', 'Close timebar settings')
              : t('timebarSettings.settings_open', 'Open timebar settings')
        }
      />
      {optionsPanelOpen && (
        <div className={styles.optionsContainer}>
          <h1>{t('timebarSettings.title', 'Timebar settings')}</h1>
          <div className={styles.radiosContainer}>
            {!isStandaloneVesselLocation && (
              <Fragment>
                <Radio
                  label={
                    <Icon
                      SvgIcon={AreaIcon}
                      label={t('common.activity', 'Activity')}
                      color={activeActivityDataviews[0]?.config?.color || COLOR_PRIMARY_BLUE}
                      disabled={!activeActivityDataviews?.length}
                    />
                  }
                  disabled={!activeActivityDataviews?.length}
                  active={timebarVisualisation === TimebarVisualisations.HeatmapActivity}
                  tooltip={activityTooltipLabel}
                  onClick={setHeatmapActivityActive}
                />
                <Radio
                  label={
                    <Icon
                      SvgIcon={AreaIcon}
                      label={t('common.detections', 'Detections')}
                      color={activeDetectionsDataviews[0]?.config?.color || COLOR_PRIMARY_BLUE}
                      disabled={!activeDetectionsDataviews?.length}
                    />
                  }
                  disabled={!activeDetectionsDataviews?.length}
                  active={timebarVisualisation === TimebarVisualisations.HeatmapDetections}
                  tooltip={detectionsTooltipLabel}
                  onClick={setHeatmapDetectionsActive}
                />
                {activeVesselGroupDataviews.map((vgDataview) => {
                  return (
                    <Radio
                      key={vgDataview.id}
                      label={
                        <Icon
                          SvgIcon={AreaIcon}
                          label={vgDataview.vesselGroup?.name as string}
                          color={vgDataview?.config?.color || COLOR_PRIMARY_BLUE}
                        />
                      }
                      active={
                        timebarVisualisation === TimebarVisualisations.VesselGroup &&
                        timebarSelectedVGId === vgDataview.id
                      }
                      tooltip={activityTooltipLabel}
                      onClick={() => setVesselGroupActive(vgDataview.id)}
                    />
                  )
                })}
              </Fragment>
            )}
            <Radio
              label={
                <Icon
                  SvgIcon={TracksIcon}
                  label={t('timebarSettings.tracks', 'Tracks')}
                  color={activeTrackDataviews[0]?.config?.color || COLOR_PRIMARY_BLUE}
                  disabled={!activeTrackDataviews?.length}
                />
              }
              disabled={!activeTrackDataviews?.length}
              active={
                timebarVisualisation === TimebarVisualisations.Vessel &&
                timebarGraph === TimebarGraphs.None
              }
              tooltip={
                !activeTrackDataviews?.length
                  ? t('timebarSettings.tracksDisabled', 'Select at least one vessel')
                  : t('timebarSettings.showTracks', 'Show tracks graph')
              }
              onClick={setVesselActive}
            />
            <Radio
              label={
                <Icon
                  SvgIcon={TrackSpeedIcon}
                  label={t('timebarSettings.graphSpeed', 'Vessel Speed')}
                  color={activeTrackDataviews[0]?.config?.color || COLOR_PRIMARY_BLUE}
                  disabled={!hasSomeVesselLayer || !activeTrackDataviews?.length}
                />
              }
              disabled={!hasSomeVesselLayer || !activeTrackDataviews?.length}
              active={
                timebarVisualisation === TimebarVisualisations.Vessel &&
                timebarGraph === TimebarGraphs.Speed
              }
              tooltip={getVesselGraphTooltip('speed')}
              onClick={setVesselGraphSpeed}
            />
            <Radio
              label={
                <Icon
                  SvgIcon={TrackDepthIcon}
                  label={t('timebarSettings.graphDepth', 'Vessel Depth')}
                  color={activeTrackDataviews[0]?.config?.color || COLOR_PRIMARY_BLUE}
                  disabled={!hasSomeVesselLayer || !activeTrackDataviews?.length}
                />
              }
              disabled={!hasSomeVesselLayer || !activeTrackDataviews?.length}
              active={
                timebarVisualisation === TimebarVisualisations.Vessel &&
                timebarGraph === TimebarGraphs.Depth
              }
              tooltip={getVesselGraphTooltip('depth')}
              onClick={setVesselGraphDepth}
            />
            {activeEnvironmentalDataviews.map((envDataview) => {
              const dataset = envDataview.datasets?.find(
                (d) => d.type === DatasetTypes.Fourwings || d.type === DatasetTypes.UserContext
              )
              const title = t(
                `datasets:${dataset?.id}.name` as any,
                dataset?.name || dataset?.id || ''
              )
              return (
                <Radio
                  key={envDataview.id}
                  label={
                    <Icon
                      SvgIcon={AreaIcon}
                      label={title}
                      color={envDataview?.config?.color || COLOR_PRIMARY_BLUE}
                    />
                  }
                  active={
                    timebarVisualisation === TimebarVisualisations.Environment &&
                    timebarSelectedEnvId === envDataview.id
                  }
                  tooltip={activityTooltipLabel}
                  onClick={() => setEnvironmentActive(envDataview.id)}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default TimebarSettings
