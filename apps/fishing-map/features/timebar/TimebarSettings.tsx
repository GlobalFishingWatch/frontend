import type { ComponentType } from 'react'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { IconButton, Radio } from '@globalfishingwatch/ui-components'

import AreaIcon from 'assets/icons/timebar-area.svg'
import TrackDepthIcon from 'assets/icons/timebar-track-depth.svg'
import TrackPositionsIcon from 'assets/icons/timebar-track-positions.svg'
import TrackSpeedIcon from 'assets/icons/timebar-track-speed.svg'
import TracksIcon from 'assets/icons/timebar-tracks.svg'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import {
  selectActiveActivityDataviews,
  selectActiveDetectionsDataviews,
  selectActiveEventsDataviews,
  selectActiveUserPointsDataviews,
  selectActiveVesselGroupDataviews,
  selectActiveVesselsDataviews,
} from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectActiveTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectActiveHeatmapEnvironmentalDataviewsWithoutStatic } from 'features/dataviews/selectors/dataviews.selectors'
import { selectDebugOptions } from 'features/debug/debug.slice'
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
  const activeEventsDataviews = useSelector(selectActiveEventsDataviews)
  const activeEnvironmentalDataviews = useSelector(
    selectActiveHeatmapEnvironmentalDataviewsWithoutStatic
  )
  const activeTrackDataviews = useSelector(selectActiveTrackDataviews)
  const activeVesselGroupDataviews = useSelector(selectActiveVesselGroupDataviews)
  const activeUserPointsDataviews = useSelector(selectActiveUserPointsDataviews)
  const isStandaloneVesselLocation = useSelector(selectIsVesselLocation)
  const activeVesselsDataviews = useSelector(selectActiveVesselsDataviews)
  const hasSomeVesselLayer = activeVesselsDataviews?.length > 0
  const vesselsAsPositions = useSelector(selectDebugOptions)?.vesselsAsPositions
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

  const setTimebarSectionActive = (section: TimebarVisualisations) => {
    dispatchTimebarVisualisation(section)
    trackEvent({
      category: TrackCategory.Timebar,
      action: 'select_timebar_settings',
      label: `${section}`,
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

  const setVesselGraph = (timebarGraph: TimebarGraphs) => {
    dispatchTimebarVisualisation(TimebarVisualisations.Vessel)
    dispatchTimebarGraph(timebarGraph)
    trackEvent({
      category: TrackCategory.Timebar,
      action: 'select_timebar_settings',
      label: `${TimebarVisualisations.Vessel} - ${timebarGraph}`,
    })
  }

  const getVesselGraphTooltip = (graph: 'speed' | 'depth') => {
    let tooltipLabel: string =
      graph === 'depth' ? t('timebarSettings.showGraphDepth') : t('timebarSettings.showGraphSpeed')
    if (!activeTrackDataviews?.length) {
      tooltipLabel = t('timebarSettings.tracksDisabled')
    } else if (!timebarGraphEnabled) {
      tooltipLabel = t('timebarSettings.graphDisabled')
    } else if (!hasSomeVesselLayer) {
      tooltipLabel = t('timebarSettings.graphVesselOnly', {
        graph:
          graph === 'depth' ? t('timebarSettings.graphDepth') : t('timebarSettings.graphSpeed'),
      })
    }
    return tooltipLabel
  }

  const expandedContainerRef = useClickedOutside(closeOptions)

  const activityTooltipLabel = !activeActivityDataviews?.length
    ? t('timebarSettings.activityDisabled')
    : t('timebarSettings.showActivity')

  const detectionsTooltipLabel = !activeDetectionsDataviews?.length
    ? t('timebarSettings.detectionsDisabled')
    : t('timebarSettings.showDetections')

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
              ? t('timebarSettings.settings_close')
              : t('timebarSettings.settings_open')
        }
      />
      {optionsPanelOpen && (
        <div className={styles.optionsContainer}>
          <h1>{t('timebarSettings.title')}</h1>
          <div className={styles.radiosContainer}>
            {!isStandaloneVesselLocation && (
              <Fragment>
                <Radio
                  label={
                    <Icon
                      SvgIcon={AreaIcon}
                      label={t('common.activity')}
                      color={activeActivityDataviews[0]?.config?.color || COLOR_PRIMARY_BLUE}
                      disabled={!activeActivityDataviews?.length}
                    />
                  }
                  disabled={!activeActivityDataviews?.length}
                  active={timebarVisualisation === TimebarVisualisations.HeatmapActivity}
                  tooltip={activityTooltipLabel}
                  onClick={() => setTimebarSectionActive(TimebarVisualisations.HeatmapActivity)}
                />
                <Radio
                  label={
                    <Icon
                      SvgIcon={AreaIcon}
                      label={t('common.detections')}
                      color={activeDetectionsDataviews[0]?.config?.color || COLOR_PRIMARY_BLUE}
                      disabled={!activeDetectionsDataviews?.length}
                    />
                  }
                  disabled={!activeDetectionsDataviews?.length}
                  active={timebarVisualisation === TimebarVisualisations.HeatmapDetections}
                  tooltip={detectionsTooltipLabel}
                  onClick={() => setTimebarSectionActive(TimebarVisualisations.HeatmapDetections)}
                />
                <Radio
                  label={
                    <Icon
                      SvgIcon={AreaIcon}
                      label={t('common.events')}
                      color={activeEventsDataviews[0]?.config?.color || COLOR_PRIMARY_BLUE}
                      disabled={!activeEventsDataviews?.length}
                    />
                  }
                  disabled={!activeEventsDataviews?.length}
                  active={timebarVisualisation === TimebarVisualisations.Events}
                  tooltip={detectionsTooltipLabel}
                  onClick={() => setTimebarSectionActive(TimebarVisualisations.Events)}
                />
                {activeUserPointsDataviews.length > 0 && (
                  <Radio
                    label={
                      <Icon
                        SvgIcon={AreaIcon}
                        label={t('common.others')}
                        color={activeUserPointsDataviews[0]?.config?.color || COLOR_PRIMARY_BLUE}
                        disabled={!activeUserPointsDataviews?.length}
                      />
                    }
                    // disabled={!activeUserPointsDataviews?.length}
                    active={timebarVisualisation === TimebarVisualisations.Points}
                    tooltip={t('timebarSettings.showOthers')}
                    onClick={() => setTimebarSectionActive(TimebarVisualisations.Points)}
                  />
                )}
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
                  SvgIcon={vesselsAsPositions ? TrackPositionsIcon : TracksIcon}
                  label={t('timebarSettings.tracks')}
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
                  ? t('timebarSettings.tracksDisabled')
                  : t('timebarSettings.showTracks')
              }
              onClick={setVesselActive}
            />
            <Radio
              label={
                <Icon
                  SvgIcon={TrackSpeedIcon}
                  label={t('timebarSettings.graphSpeed')}
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
              onClick={() => setVesselGraph(TimebarGraphs.Speed)}
            />
            <Radio
              label={
                <Icon
                  SvgIcon={TrackDepthIcon}
                  label={t('timebarSettings.graphDepth')}
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
              onClick={() => setVesselGraph(TimebarGraphs.Depth)}
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
