import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { center } from '@turf/center'
import type { Feature, Point } from 'geojson'
import { DateTime } from 'luxon'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Button, Choice, Icon, IconButton, InputText } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import I18nDate from 'features/i18n/i18nDate'
import { useSetTrackCorrectionId } from 'features/track-correction/track-correction.hooks'
import type { IssueType, TrackCorrection } from 'features/track-correction/track-correction.slice'
import {
  createCommentThunk,
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
import {
  selectCurrentTrackCorrectionIssue,
  selectIsNewTrackCorrection,
} from 'features/track-correction/track-selection.selectors'
import TrackSlider from 'features/track-correction/TrackSlider'
import { selectIsGuestUser, selectUserData } from 'features/user/selectors/user.selectors'
import { isRegistryInTimerange } from 'features/vessel/identity/VesselIdentitySelector'
import { useGetVesselInfoByDataviewId } from 'features/vessel/vessel.hooks'
import { getVesselIdentities, getVesselProperty } from 'features/vessel/vessel.utils'
import FitBounds from 'features/workspace/shared/FitBounds'
import { selectCurrentWorkspaceId } from 'features/workspace/workspace.selectors'
import { getVesselGearTypeLabel, getVesselShipNameLabel, getVesselShipTypeLabel } from 'utils/info'

import TrackCommentsList from './TrackCommentsList'

import styles from './TrackCorrection.module.css'

const issueTypesOptions: ChoiceOption<IssueType>[] = [
  { id: 'falsePositive', label: 'False positive' },
  { id: 'falseNegative', label: 'False negative' },
  { id: 'other', label: 'Other' },
]

const TrackCorrection = () => {
  const { t } = useTranslation()
  const { start, end } = useSelector(selectTimeRange)
  const issueType = useSelector(selectTrackIssueType)
  const issueComment = useSelector(selectTrackIssueComment)
  const dispatch = useAppDispatch()
  const isGuestUser = useSelector(selectIsGuestUser)
  const setTrackCorrectionId = useSetTrackCorrectionId()

  const currentWorkspaceId = useSelector(selectCurrentWorkspaceId)

  const isNewTrackCorrection = useSelector(selectIsNewTrackCorrection)
  const currentTrackCorrectionIssue = useSelector(selectCurrentTrackCorrectionIssue)
  const [isTimerangePristine, setIsTimerangePristine] = useState(true)
  const [isResolved, setIsResolved] = useState(false)
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
    (issueId: string, marksAsResolved: boolean) => ({
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
      marksAsResolved,
    }),
    [userData, issueComment]
  )

  const onConfirmClick = useCallback(
    async (trackCorrectionTimerange: { start: string; end: string }) => {
      try {
        setIsSubmitting(true)
        const workspaceId = 'default-public'

        if (isNewTrackCorrection) {
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
            resolved: isResolved,
            lon: middlePoint.geometry.coordinates[0],
            lat: middlePoint.geometry.coordinates[1],
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

          const commentBody = buildCommentBody(issueId, isResolved)

          await dispatch(
            createNewIssueThunk({
              issueBody,
              commentBody,
              workspaceId,
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
        } else if (currentTrackCorrectionIssue) {
          const issueId = currentTrackCorrectionIssue?.issueId
          if (!issueId) {
            console.error('No issueId found for the current track correction issue.')
            return
          }
          const commentBody = buildCommentBody(issueId, isResolved)

          await dispatch(
            createCommentThunk({
              issueId,
              commentBody,
              workspaceId,
            })
          )
            .unwrap()
            .then(() => {
              dispatch(fetchTrackIssuesThunk({ workspaceId }))
              dispatch(setTrackIssueComment(''))
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
      isNewTrackCorrection,
      currentTrackCorrectionIssue,
      vesselLayer?.instance,
      trackCorrectionVesselDataviewId,
      vesselInfo,
      dataview?.config?.name,
      userData?.email,
      issueType,
      isResolved,
      buildCommentBody,
      dispatch,
      setTrackCorrectionId,
    ]
  )

  if (isGuestUser || !userData) return null

  return (
    <div className={styles.container}>
      {isNewTrackCorrection ? (
        <>
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
          {currentTrackCorrectionIssue ? (
            <Fragment>
              <I18nDate
                date={currentTrackCorrectionIssue.startDate}
                format={DateTime.DATETIME_MED}
                showUTCLabel={false}
              />
              {' - '}
              <I18nDate
                date={currentTrackCorrectionIssue.endDate}
                format={DateTime.DATETIME_MED}
                showUTCLabel={false}
              />
            </Fragment>
          ) : (
            <TrackSlider
              rangeStartTime={getUTCDateTime(start).toMillis()}
              rangeEndTime={getUTCDateTime(end).toMillis()}
              segments={trackData ?? []}
              color={vesselColor}
              onTimerangeChange={(start, end) => {
                setIsTimerangePristine(false)
              }}
            />
          )}

          <div className={styles.disclaimer}>
            <Icon type="default" icon="warning" />
            <span>{t('trackCorrection.adjustDisclaimer')}</span>
          </div>
          <div>
            <label>{t('trackCorrection.issueType')}</label>
            <Choice
              options={issueTypesOptions}
              activeOption={issueType}
              onSelect={(option) => {
                dispatch(setTrackIssueType(option.id))
              }}
              size="small"
            />
          </div>
        </>
      ) : (
        currentTrackCorrectionIssue && (
          <div>
            <div className={styles.item}>
              <h2>
                {currentTrackCorrectionIssue.vesselName
                  ? currentTrackCorrectionIssue.vesselName
                  : (vesselInfo && getVesselShipNameLabel(vesselInfo)) || dataview?.config?.name}
                {' - '} {currentTrackCorrectionIssue.issueId}
              </h2>
              <h2>{t(`trackCorrection.${currentTrackCorrectionIssue.type}`)}</h2>
              <label>
                <I18nDate
                  date={currentTrackCorrectionIssue.startDate}
                  format={DateTime.DATETIME_MED}
                  showUTCLabel={false}
                />
                {' - '}
                <I18nDate
                  date={currentTrackCorrectionIssue.endDate}
                  format={DateTime.DATETIME_MED}
                  showUTCLabel={false}
                />
              </label>
            </div>
            {currentTrackCorrectionIssue && (
              <TrackCommentsList track={currentTrackCorrectionIssue} />
            )}
          </div>
        )
      )}
      {!currentTrackCorrectionIssue?.resolved && (
        <>
          <div>
            {isNewTrackCorrection && <label>{t('trackCorrection.comment')}</label>}
            <InputText
              inputSize="small"
              placeholder={
                isNewTrackCorrection
                  ? t('trackCorrection.commentPlaceholder')
                  : t('trackCorrection.replyPlaceholder')
              }
              value={issueComment}
              className={styles.input}
              onChange={(e) => dispatch(setTrackIssueComment(e.target.value))}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.actions}>
            <span className={styles.version}>
              {
                t('trackCorrection.version') + ' 1'
                /*vesselInfo.datasetVersion*/
              }
            </span>
            <div className={styles.actions}>
              {!isNewTrackCorrection && (
                <IconButton
                  icon="tick"
                  type={isResolved ? 'map-tool' : 'border'}
                  size="small"
                  onClick={() => setIsResolved((prev) => !prev)}
                  tooltip={!isResolved && t('trackCorrection.markAsResolved')}
                />
              )}

              <Button
                tooltip={
                  isNewTrackCorrection && isTimerangePristine
                    ? t('trackCorrection.adjustDisabled')
                    : undefined
                }
                size="medium"
                disabled={
                  (isNewTrackCorrection && isTimerangePristine) ||
                  issueComment === '' ||
                  isGuestUser
                }
                onClick={() => onConfirmClick(trackCorrectionTimerange)}
                loading={isSubmitting}
              >
                {isNewTrackCorrection
                  ? t('common.confirm')
                  : isResolved
                    ? t('trackCorrection.commentResolve')
                    : t('trackCorrection.comment')}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TrackCorrection
