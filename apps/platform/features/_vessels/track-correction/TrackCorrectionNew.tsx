import { Fragment, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { centerOfMass } from '@turf/turf'
import type { Feature, Point } from 'geojson'

import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { getVesselIdFromInstanceId } from '@globalfishingwatch/dataviews-client'
import { Button, Choice, Icon, InputText } from '@globalfishingwatch/ui-components'

import { useMapViewState } from 'features/_map/map/map-viewport.hooks'
import { selectTimeRange } from 'features/_map/workspace/selectors/app.timebar.selectors'
import FitBounds from 'features/_map/workspace/shared/FitBounds'
import { selectCurrentWorkspaceId } from 'features/_map/workspace/workspace.selectors'
import { selectIsGuestUser, selectUserData } from 'features/_user/selectors/user.selectors'
import type { TurningTidesWorkspaceId } from 'features/_vessels/track-correction/track-correction.config'
import { getTrackCorrectionIssueOptions } from 'features/_vessels/track-correction/track-correction.config'
import { useSetTrackCorrectionId } from 'features/_vessels/track-correction/track-correction.hooks'
import type { TrackCorrection } from 'features/_vessels/track-correction/track-correction.slice'
import {
  createNewIssueThunk,
  fetchTrackIssuesThunk,
  selectTrackCorrectionTimerange,
  selectTrackCorrectionVesselDataviewId,
  selectTrackIssueComment,
  selectTrackIssueType,
  setTrackCorrectionTimerange,
  setTrackIssueComment,
  setTrackIssueType,
} from 'features/_vessels/track-correction/track-correction.slice'
import { getCustomVesselPropertiesByWorkspaceId } from 'features/_vessels/track-correction/track-correction.utils'
import TrackSlider from 'features/_vessels/track-correction/TrackSlider'
import { useGetVesselInfoByDataviewId } from 'features/_vessels/vessel/vessel.hooks'
import { getVesselProperty } from 'features/_vessels/vessel/vessel.utils'
import { getVesselShipNameLabel } from 'features/_vessels/vessel/vessel-label.utils'
import { useAppDispatch } from 'features/app/app.hooks'
import { getCurrentAppUrl } from 'router/routes.utils'
import { getVesselGearTypeLabel, getVesselShipTypeLabel } from 'utils/info'

import styles from './TrackCorrection.module.css'

const TrackCorrectionNew = () => {
  const { t } = useTranslation()
  const { start, end } = useSelector(selectTimeRange)
  const issueType = useSelector(selectTrackIssueType)
  const issueComment = useSelector(selectTrackIssueComment)
  const dispatch = useAppDispatch()
  const isGuestUser = useSelector(selectIsGuestUser)
  const setTrackCorrectionId = useSetTrackCorrectionId()
  const viewState = useMapViewState()

  const workspaceId = useSelector(selectCurrentWorkspaceId) as TurningTidesWorkspaceId

  const [isSubmitting, setIsSubmitting] = useState(false)

  const trackCorrectionVesselDataviewId = useSelector(selectTrackCorrectionVesselDataviewId)
  const trackCorrectionTimerange = useSelector(selectTrackCorrectionTimerange)
  const { dataview, vesselInfoResource, vesselLayer } = useGetVesselInfoByDataviewId(
    trackCorrectionVesselDataviewId
  )
  const vesselInfo = vesselInfoResource?.data
  const vesselColor = dataview?.config?.color
  const userData = useSelector(selectUserData)

  const trackData = useMemo(() => {
    return vesselLayer?.instance
      ?.getVesselTrackSegments({
        includeMiddlePoints: true,
        startTime: getUTCDateTime(start).toMillis(),
        endTime: getUTCDateTime(end).toMillis(),
      })
      .filter((segment) => segment.length > 0)
  }, [end, start, vesselLayer?.instance])

  const buildCommentBody = useCallback(
    (issueId: string) => ({
      issueId,
      user: (userData?.firstName || '') + ' ' + (userData?.lastName || '') || 'Anonymous',
      date: new Date().toISOString(),
      comment: issueComment,
      datasetVersion: 1,
      marksAsResolved: false,
      confirmed: false,
    }),
    [userData, issueComment]
  )

  const onConfirmClick = useCallback(
    async (trackCorrectionTimerange: { start: string; end: string }) => {
      if (!workspaceId) {
        return
      }

      try {
        setIsSubmitting(true)

        const trackCorrectionSegments = vesselLayer?.instance?.getVesselTrackSegments({
          includeMiddlePoints: true,
          includeCoordinates: true,
          startTime: getUTCDateTime(trackCorrectionTimerange.start).toMillis(),
          endTime: getUTCDateTime(trackCorrectionTimerange.end).toMillis(),
        })

        const middlePoint = centerOfMass({
          type: 'FeatureCollection',
          features: trackCorrectionSegments.flatMap((segment) =>
            segment.length
              ? segment.map(
                  (point) =>
                    ({
                      type: 'Feature',

                      geometry: {
                        type: 'Point',
                        coordinates: [point.longitude, point.latitude],
                      },
                    }) as Feature<Point>
                )
              : []
          ),
        })

        if (middlePoint.geometry.coordinates[0] > 180) {
          middlePoint.geometry.coordinates[0] -= 360
        }

        const issueId = Date.now().toString()
        const customVesselProperties = getCustomVesselPropertiesByWorkspaceId(
          workspaceId,
          vesselInfo!,
          trackCorrectionTimerange
        )
        const issueBody: TrackCorrection = {
          issueId,
          vesselId: getVesselIdFromInstanceId(trackCorrectionVesselDataviewId),
          ssvid: vesselInfo?.selfReportedInfo?.[0]?.ssvid || '',
          vesselName: vesselInfo ? getVesselShipNameLabel(vesselInfo) : dataview?.config?.name,
          userEmail: userData?.email || '',
          startDate_original: trackCorrectionTimerange.start,
          endDate_original: trackCorrectionTimerange.end,
          workspaceLink: getCurrentAppUrl().replace(
            'trackCorrectionId=new',
            `trackCorrectionId=${issueId}`
          ),
          confirmed: false,
          type: issueType,
          lastUpdated: new Date().toISOString(),
          resolved: false,
          lon: middlePoint.geometry.coordinates[0],
          lat: middlePoint.geometry.coordinates[1],
          zoom: viewState.zoom,
          source: vesselInfo!.dataset,
          ...customVesselProperties,
        }

        const commentBody = buildCommentBody(issueId)

        await dispatch(
          createNewIssueThunk({
            issueBody,
            commentBody,
            workspaceId: workspaceId,
          })
        )
          .unwrap()
          .then(() => {
            dispatch(setTrackIssueComment(''))
            setTrackCorrectionId('')
            dispatch(
              setTrackCorrectionTimerange({
                start: '',
                end: '',
              })
            )
            dispatch(fetchTrackIssuesThunk({ workspaceId: workspaceId }))
          })
          .catch((err) => {
            console.error('Failed to submit:', err)
          })
      } catch (error) {
        console.error('Error submitting track correction:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      workspaceId,
      vesselLayer?.instance,
      vesselInfo,
      trackCorrectionVesselDataviewId,
      dataview?.config?.name,
      userData?.email,
      issueType,
      viewState.zoom,
      buildCommentBody,
      dispatch,
      setTrackCorrectionId,
    ]
  )
  if (!trackCorrectionVesselDataviewId) {
    return (
      <>
        <h1 className={styles.title}>{t((t) => t.trackCorrection.title)}</h1>
        <div className={styles.container}>
          <Icon type="default" icon="warning" />
          {t((t) => t.trackCorrection.badLink)}
        </div>
      </>
    )
  }

  if (isGuestUser || !userData) return null

  return (
    <Fragment>
      <h1 className={styles.title}>{t((t) => t.trackCorrection.newIssue)}</h1>
      <div className={styles.container}>
        <div>
          <label>{t((t) => t.common.vessel)}</label>
          <div className={styles.vessel}>
            <span className={styles.vesselLabel}>
              <Icon icon="vessel" style={{ color: vesselColor }} />
              {(vesselInfo && getVesselShipNameLabel(vesselInfo)) || dataview?.config?.name}
            </span>

            <FitBounds layer={vesselLayer?.instance} disabled={!vesselLayer?.loaded} />
          </div>
        </div>
        {vesselInfo && (
          <div className={styles.vesselInfo}>
            <div>
              <label>{t((t) => t.common.flag)}</label>
              {getVesselProperty(vesselInfo, 'flag')}
            </div>
            <div>
              <label>{t((t) => t.vessel.shiptype)}</label>
              {getVesselShipTypeLabel({ shiptypes: getVesselProperty(vesselInfo, 'shiptypes') })}
            </div>
            <div>
              <label>{t((t) => t.vessel.geartype)}</label>
              {getVesselGearTypeLabel({ geartypes: getVesselProperty(vesselInfo, 'geartypes') })}
            </div>
          </div>
        )}

        <div>
          <label>{t((t) => t.common.timerange)}</label>
          <TrackSlider
            rangeStartTime={getUTCDateTime(start).toMillis()}
            rangeEndTime={getUTCDateTime(end).toMillis()}
            segments={trackData ?? []}
            color={vesselColor}
          />
        </div>

        <div className={styles.disclaimer}>
          <Icon type="default" icon="warning" />
          <span>{t((t) => t.trackCorrection.adjustDisclaimer)}</span>
        </div>
        <Choice
          label={t((t) => t.trackCorrection.issueType)}
          options={getTrackCorrectionIssueOptions()}
          activeOption={issueType}
          onSelect={(option) => {
            dispatch(setTrackIssueType(option.id))
          }}
          size="small"
        />
        <InputText
          label={t((t) => t.trackCorrection.comment)}
          inputSize="small"
          placeholder={t((t) => t.trackCorrection.commentPlaceholder)}
          value={issueComment}
          className={styles.input}
          onChange={(e) => dispatch(setTrackIssueComment(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onConfirmClick(trackCorrectionTimerange)
            }
          }}
          disabled={isSubmitting}
        />
        <div className={styles.actions}>
          <span className={styles.version}>
            {
              t((t) => t.trackCorrection.version) + ' 1'
              /*vesselInfo.datasetVersion*/
            }
          </span>

          <Button
            size="medium"
            onClick={() => onConfirmClick(trackCorrectionTimerange)}
            loading={isSubmitting}
          >
            {t((t) => t.common.confirm)}
          </Button>
        </div>
      </div>
    </Fragment>
  )
}

export default TrackCorrectionNew
