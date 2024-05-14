import { Fragment, useState, ComponentType } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton, Radio } from '@globalfishingwatch/ui-components'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import useClickedOutside from 'hooks/use-clicked-outside'
import { TimebarGraphs, TimebarVisualisations } from 'types'
import {
  selectActiveReportActivityDataviews,
  selectActiveDetectionsDataviews,
  selectActiveHeatmapEnvironmentalDataviewsWithoutStatic,
} from 'features/dataviews/selectors/dataviews.selectors'
import { getEventLabel } from 'utils/analytics'
import { ReactComponent as AreaIcon } from 'assets/icons/timebar-area.svg'
import { ReactComponent as TracksIcon } from 'assets/icons/timebar-tracks.svg'
import { ReactComponent as TrackSpeedIcon } from 'assets/icons/timebar-track-speed.svg'
import { ReactComponent as TrackDepthIcon } from 'assets/icons/timebar-track-depth.svg'
import { selectHasTracksData } from 'features/timebar/timebar.selectors'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectIsVesselLocation } from 'routes/routes.selectors'
import {
  selectActiveTrackDataviews,
  selectActiveVesselsDataviews,
} from 'features/dataviews/selectors/dataviews.instances.selectors'
import {
  useTimebarVisualisationConnect,
  useTimebarGraphConnect,
  useTimebarEnvironmentConnect,
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
  const activeActivityDataviews = useSelector(selectActiveReportActivityDataviews)
  const activeDetectionsDataviews = useSelector(selectActiveDetectionsDataviews)
  const activeEnvironmentalDataviews = useSelector(
    selectActiveHeatmapEnvironmentalDataviewsWithoutStatic
  )
  const activeTrackDataviews = useSelector(selectActiveTrackDataviews)
  const isStandaloneVesselLocation = useSelector(selectIsVesselLocation)
  const hasTracksData = useSelector(selectHasTracksData)
  const activeVesselsDataviews = useSelector(selectActiveVesselsDataviews)
  const { timebarVisualisation, dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const { timebarSelectedEnvId, dispatchTimebarSelectedEnvId } = useTimebarEnvironmentConnect()
  const { timebarGraph, dispatchTimebarGraph } = useTimebarGraphConnect()
  const timebarGraphEnabled = activeVesselsDataviews && activeVesselsDataviews!?.length <= 2

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
  }
  const setHeatmapDetectionsActive = () => {
    dispatchTimebarVisualisation(TimebarVisualisations.HeatmapDetections)
  }
  const setEnvironmentActive = (environmentalDataviewId: string) => {
    dispatchTimebarVisualisation(TimebarVisualisations.Environment)
    dispatchTimebarSelectedEnvId(environmentalDataviewId)
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
              </Fragment>
            )}
            <Radio
              label={
                <Icon
                  SvgIcon={TracksIcon}
                  label={t('timebarSettings.tracks', 'Tracks')}
                  color={activeTrackDataviews[0]?.config?.color || COLOR_PRIMARY_BLUE}
                  disabled={!hasTracksData || !activeTrackDataviews?.length}
                />
              }
              disabled={!hasTracksData || !activeTrackDataviews?.length}
              active={
                timebarVisualisation === TimebarVisualisations.Vessel &&
                (timebarGraph === TimebarGraphs.None || !timebarGraphEnabled)
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
                  disabled={!hasTracksData || !activeTrackDataviews?.length || !timebarGraphEnabled}
                />
              }
              disabled={!hasTracksData || !activeTrackDataviews?.length || !timebarGraphEnabled}
              active={
                timebarVisualisation === TimebarVisualisations.Vessel &&
                timebarGraph === TimebarGraphs.Speed &&
                timebarGraphEnabled
              }
              tooltip={
                !activeTrackDataviews?.length
                  ? t('timebarSettings.tracksDisabled', 'Select at least one vessel')
                  : !timebarGraphEnabled
                  ? t(
                      'timebarSettings.graphDisabled',
                      'Not available with more than 2 vessels selected'
                    )
                  : t('timebarSettings.showGraphSpeed', 'Show track speed graph')
              }
              onClick={setVesselGraphSpeed}
            />
            <Radio
              label={
                <Icon
                  SvgIcon={TrackDepthIcon}
                  label={t('timebarSettings.graphDepth', 'Vessel Depth')}
                  color={activeTrackDataviews[0]?.config?.color || COLOR_PRIMARY_BLUE}
                  disabled={!hasTracksData || !activeTrackDataviews?.length || !timebarGraphEnabled}
                />
              }
              disabled={!hasTracksData || !activeTrackDataviews?.length || !timebarGraphEnabled}
              active={
                timebarVisualisation === TimebarVisualisations.Vessel &&
                timebarGraph === TimebarGraphs.Depth &&
                timebarGraphEnabled
              }
              tooltip={
                !activeTrackDataviews?.length
                  ? t('timebarSettings.tracksDisabled', 'Select at least one vessel')
                  : !timebarGraphEnabled
                  ? t(
                      'timebarSettings.graphDisabled',
                      'Not available with more than 2 vessels selected'
                    )
                  : t('timebarSettings.showGraphDepth', 'Show track depth graph')
              }
              onClick={setVesselGraphDepth}
            />
            {activeEnvironmentalDataviews.map((envDataview, i) => {
              const dataset = envDataview.datasets?.find(
                (d) => d.type === DatasetTypes.Fourwings || d.type === DatasetTypes.UserContext
              )
              const title = t(
                `datasets:${dataset?.id}.name` as any,
                dataset!?.name || dataset!?.id || ''
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
