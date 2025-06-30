import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { center } from '@turf/center'
import type { Feature, Point } from 'geojson'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { Button, Choice, Icon, InputText } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { useMapViewState } from 'features/map/map-viewport.hooks'
import { getTrackCorrectionIssueOptions } from 'features/track-correction/track-correction.config'
import { useSetTrackCorrectionId } from 'features/track-correction/track-correction.hooks'
import type { TrackCorrection } from 'features/track-correction/track-correction.slice'
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
} from 'features/track-correction/track-correction.slice'
import TrackSlider from 'features/track-correction/TrackSlider'
import { selectIsGuestUser, selectUserData } from 'features/user/selectors/user.selectors'
import { isRegistryInTimerange } from 'features/vessel/identity/VesselIdentitySelector'
import { useGetVesselInfoByDataviewId } from 'features/vessel/vessel.hooks'
import { getVesselIdentities, getVesselProperty } from 'features/vessel/vessel.utils'
import FitBounds from 'features/workspace/shared/FitBounds'
import { selectCurrentWorkspaceId } from 'features/workspace/workspace.selectors'
import { getVesselGearTypeLabel, getVesselShipNameLabel, getVesselShipTypeLabel } from 'utils/info'

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

  const workspaceId = useSelector(selectCurrentWorkspaceId)

  const [isTimerangePristine, setIsTimerangePristine] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const trackCorrectionVesselDataviewId = useSelector(selectTrackCorrectionVesselDataviewId)
  const trackCorrectionTimerange = useSelector(selectTrackCorrectionTimerange)
  const { dataview, vesselInfoResource, vesselLayer } = useGetVesselInfoByDataviewId(
    trackCorrectionVesselDataviewId
  )
  const vesselInfo = vesselInfoResource?.data
  const vesselColor = dataview?.config?.color

  const userData = useSelector(selectUserData)

  useEffect(() => {
    if (trackCorrectionVesselDataviewId) {
      setIsTimerangePristine(true)
    }
  }, [trackCorrectionVesselDataviewId])

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
      userEmail: userData?.email || '',
      workspaceLink: window.location.href.replace(
        'trackCorrectionId=new',
        `trackCorrectionId=${issueId}`
      ),
      date: new Date().toISOString(),
      comment: issueComment || 'No comment provided',
      datasetVersion: 1,
      marksAsResolved: false,
    }),
    [userData, issueComment]
  )

  const onConfirmClick = useCallback(
    async (trackCorrectionTimerange: { start: string; end: string }) => {
      try {
        setIsSubmitting(true)

        const trackCorrectionSegments = vesselLayer?.instance?.getVesselTrackSegments({
          includeMiddlePoints: true,
          includeCoordinates: true,
          startTime: getUTCDateTime(trackCorrectionTimerange.start).toMillis(),
          endTime: getUTCDateTime(trackCorrectionTimerange.end).toMillis(),
        })

        const middlePoint = center({
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

        const issueId = Date.now().toString()

        const issueBody: TrackCorrection = {
          issueId,
          vesselId: trackCorrectionVesselDataviewId.replace('vessel-', ''),
          vesselName: vesselInfo ? getVesselShipNameLabel(vesselInfo) : dataview?.config?.name,
          userEmail: userData?.email || '',
          startDate: trackCorrectionTimerange.start,
          endDate: trackCorrectionTimerange.end,
          workspaceLink: window.location.href,
          type: issueType,
          lastUpdated: new Date().toISOString(),
          resolved: false,
          lon: middlePoint.geometry.coordinates[0],
          lat: middlePoint.geometry.coordinates[1],
          zoom: viewState.zoom,
          source: vesselInfo?.dataset || 'unknown',
          ssvid: vesselInfo
            ? getVesselIdentities(vesselInfo, {
                identitySource: VesselIdentitySourceEnum.SelfReported,
              }).find((v) =>
                isRegistryInTimerange(
                  v,
                  trackCorrectionTimerange.start,
                  trackCorrectionTimerange.end
                )
              )?.ssvid || ''
            : '',
        }

        const commentBody = buildCommentBody(issueId)

        if (workspaceId) {
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
        }
      } catch (error) {
        console.error('Error submitting track correction:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      vesselLayer?.instance,
      trackCorrectionVesselDataviewId,
      vesselInfo,
      dataview?.config?.name,
      userData?.email,
      issueType,
      viewState.zoom,
      buildCommentBody,
      workspaceId,
      dispatch,
      setTrackCorrectionId,
    ]
  )

  if (isGuestUser || !userData) return null

  return (
    <div className={styles.container}>
      <div>
        <label>{t('common.vessel')}</label>
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
            <label>{t('common.flag')}</label>
            {getVesselProperty(vesselInfo, 'flag')}
          </div>
          <div>
            <label>{t('vessel.shiptype')}</label>
            {getVesselShipTypeLabel({ shiptypes: getVesselProperty(vesselInfo, 'shiptypes') })}
          </div>
          <div>
            <label>{t('vessel.geartype')}</label>
            {getVesselGearTypeLabel({ geartypes: getVesselProperty(vesselInfo, 'geartypes') })}
          </div>
        </div>
      )}
      <label>{t('common.timerange')}</label>
      <TrackSlider
        rangeStartTime={getUTCDateTime(start).toMillis()}
        rangeEndTime={getUTCDateTime(end).toMillis()}
        segments={trackData ?? []}
        color={vesselColor}
        onTimerangeChange={(start, end) => {
          setIsTimerangePristine(false)
        }}
      />

      <div className={styles.disclaimer}>
        <Icon type="default" icon="warning" />
        <span>{t('trackCorrection.adjustDisclaimer')}</span>
      </div>
      <div>
        <label>{t('trackCorrection.issueType')}</label>
        <Choice
          options={getTrackCorrectionIssueOptions()}
          activeOption={issueType}
          onSelect={(option) => {
            dispatch(setTrackIssueType(option.id))
          }}
          size="small"
        />
      </div>
      <div>
        <label>{t('trackCorrection.comment')}</label>
        <InputText
          inputSize="small"
          placeholder={t('trackCorrection.commentPlaceholder')}
          value={issueComment}
          className={styles.input}
          onChange={(e) => dispatch(setTrackIssueComment(e.target.value))}
          disabled={isSubmitting}
        />
      </div>
      <div className={styles.actions}>
        <Button
          tooltip={isTimerangePristine ? t('trackCorrection.adjustDisabled') : undefined}
          size="medium"
          disabled={isTimerangePristine || issueComment === '' || isGuestUser}
          onClick={() => onConfirmClick(trackCorrectionTimerange)}
          loading={isSubmitting}
        >
          {t('common.confirm')}
        </Button>
      </div>
    </div>
  )
}

export default TrackCorrectionNew
