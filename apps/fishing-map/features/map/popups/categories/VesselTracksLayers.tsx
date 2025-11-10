import { Fragment, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { groupBy, upperFirst } from 'es-toolkit'
import { DateTime } from 'luxon'

import type { Bbox } from '@globalfishingwatch/data-transforms'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { VesselTrackPickingObject } from '@globalfishingwatch/deck-layers'
import { Button, Icon } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import {
  selectActiveVesselsDataviews,
  selectCustomUserDataviews,
} from 'features/dataviews/selectors/dataviews.categories.selectors'
import { BLUE_PLANET_MODE_DATE_FORMAT, selectDebugOptions } from 'features/debug/debug.slice'
import I18nDate from 'features/i18n/i18nDate'
import { setClickedEvent } from 'features/map/map.slice'
import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import { useTimebarVisualisationConnect, useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useSetTrackCorrectionId } from 'features/track-correction/track-correction.hooks'
import { setTrackCorrectionDataviewId } from 'features/track-correction/track-correction.slice'
import { selectIsGuestUser, selectIsUserExpired } from 'features/user/selectors/user.selectors'
import { useGetVesselInfoByDataviewId } from 'features/vessel/vessel.hooks'
import { selectIsTurningTidesWorkspace } from 'features/workspace/workspace.selectors'
import { selectIsAnyVesselLocation } from 'routes/routes.selectors'
import { TimebarVisualisations } from 'types'
import { formatInfoField } from 'utils/info'

import styles from '../Popup.module.css'

type VesselTracksLayersProps = {
  features: VesselTrackPickingObject[]
  showFeaturesDetails: boolean
}

function VesselTracksTooltipRow({
  feature,
  showFeaturesDetails,
  interactionType,
}: {
  feature: VesselTrackPickingObject
  showFeaturesDetails: boolean
  interactionType?: 'point' | 'segment'
}) {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const dataviewId = feature.layerId
  const { vesselLayer } = useGetVesselInfoByDataviewId(dataviewId)
  const { dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const fitBounds = useMapFitBounds()
  const setTrackCorrectionId = useSetTrackCorrectionId()
  const { setTimerange } = useTimerangeConnect()
  const guestUser = useSelector(selectIsGuestUser)
  const isUserExpired = useSelector(selectIsUserExpired)
  const isVesselLocation = useSelector(selectIsAnyVesselLocation)
  const isTurningTidesWorkspace = useSelector(selectIsTurningTidesWorkspace)
  const { start, end } = useSelector(selectTimeRange)
  const diffDays = getUTCDateTime(end).diff(getUTCDateTime(start), 'days').days
  const bluePlanetMode = useSelector(selectDebugOptions)?.bluePlanetMode

  const onReportClick = useCallback(() => {
    if (diffDays > 14) {
      if (
        window.confirm(t('trackCorrection.reduce_issue_timerange') as string) &&
        feature.timestamp
      ) {
        const startDate = getUTCDateTime(feature.timestamp)
          .minus({ days: 6.5 })
          .startOf('day')
          .toISO() as string
        const endDate = getUTCDateTime(feature.timestamp)
          .plus({ days: 6.5 })
          .endOf('day')
          .plus({ millisecond: 1 })
          .toISO() as string
        const bbox = vesselLayer?.instance?.getVesselTrackBounds({ startDate, endDate })
        if (bbox) {
          fitBounds(bbox as Bbox, { padding: 60, fitZoom: true })
        }
        setTimerange({
          start: startDate,
          end: endDate,
        })
      }
    }
    // TODO:NTH remove other vessels from timebar while reporting
    dispatchTimebarVisualisation(TimebarVisualisations.Vessel)
    dispatch(setTrackCorrectionDataviewId(dataviewId))
    setTrackCorrectionId('new')
    dispatch(setClickedEvent(null))
  }, [
    dataviewId,
    diffDays,
    dispatch,
    dispatchTimebarVisualisation,
    feature.timestamp,
    fitBounds,
    setTimerange,
    setTrackCorrectionId,
    t,
    vesselLayer?.instance,
  ])

  return (
    <div className={styles.row} key={feature.id}>
      <div className={styles.rowText}>
        <p>
          {!showFeaturesDetails && !bluePlanetMode && formatInfoField(feature.title, 'shipname')}{' '}
          {interactionType === 'point' && feature.timestamp && (
            <span className={cx({ [styles.secondary]: !showFeaturesDetails })}>
              <I18nDate
                date={feature.timestamp}
                format={bluePlanetMode ? BLUE_PLANET_MODE_DATE_FORMAT : DateTime.DATETIME_MED}
                showUTCLabel={bluePlanetMode}
              />
            </span>
          )}
        </p>
        {showFeaturesDetails && (
          <Fragment>
            <p key="speed">
              {feature.speed !== undefined && (
                <span>
                  {upperFirst(t('eventInfo.speed'))}: {feature.speed.toFixed(2)}{' '}
                  {t('common.knots', 'knots')}
                </span>
              )}
            </p>
            <p key="depth">
              {feature.depth !== undefined && (
                <span>
                  {upperFirst(t('eventInfo.depth'))}: {feature.depth} {t('common.meters')}
                </span>
              )}
            </p>
          </Fragment>
        )}
        {showFeaturesDetails &&
          !guestUser &&
          !isUserExpired &&
          !isVesselLocation &&
          isTurningTidesWorkspace && (
            <div>
              <Button onClick={onReportClick} className={styles.rowMarginTop}>
                <span>{t('trackCorrection.logAnIssue')}</span>
              </Button>
            </div>
          )}
      </div>
    </div>
  )
}

function VesselTracksTooltipSection({
  features,
  showFeaturesDetails = false,
}: VesselTracksLayersProps) {
  const trackDataviews = useSelector(selectActiveVesselsDataviews) as UrlDataviewInstance[]
  const userDataviews = useSelector(selectCustomUserDataviews) as UrlDataviewInstance[]
  const featuresByType = groupBy(features, (f) => f.layerId)
  const dataviews = useMemo(
    () => [...trackDataviews, ...userDataviews],
    [trackDataviews, userDataviews]
  )
  const bluePlanetMode = useSelector(selectDebugOptions)?.bluePlanetMode

  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => {
        const { color, datasetId, title } = featureByType[0]
        const dataview = dataviews.find((d) => d.id === title)
        const dataset = dataview?.datasets?.find((d) => d.id === datasetId)
        const rowTitle = dataset ? getDatasetLabel(dataset) : title
        if (showFeaturesDetails && featureByType[0].interactionType === 'segment') {
          return null
        }
        return (
          <div key={`${featureByType[0].title}-${index}`} className={styles.popupSection}>
            <Icon
              icon="vessel"
              className={styles.layerIcon}
              style={{ color, transform: `rotate(${-45 + featureByType[0].course!}deg)` }}
            />
            <div className={styles.popupSectionContent}>
              {showFeaturesDetails && !bluePlanetMode && (
                <h3 className={styles.popupSectionTitle}>{rowTitle}</h3>
              )}
              {featureByType.map((feature) => {
                return (
                  <VesselTracksTooltipRow
                    key={feature.id}
                    feature={feature}
                    showFeaturesDetails={showFeaturesDetails}
                    interactionType={featureByType[0].interactionType}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </Fragment>
  )
}

export default VesselTracksTooltipSection
