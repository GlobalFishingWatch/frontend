import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { center } from '@turf/center'
import type { Feature, Point } from 'geojson'
import { DateTime } from 'luxon'

import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Button, Choice, Icon, IconButton, InputText } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import I18nDate from 'features/i18n/i18nDate'
import type { IssueType, TrackCorrection } from 'features/track-correction/track-correction.slice'
import {
  createCommentThunk,
  createNewIssueThunk,
  selectTrackCorrectionTimerange,
  selectTrackCorrectionVesselDataviewId,
  selectTrackIssueComment,
  selectTrackIssueType,
  setTrackIssueComment,
  setTrackIssueType,
} from 'features/track-correction/track-correction.slice'
import {
  selectCurrentTrackCorrectionIssue,
  selectIsNewTrackCorrection,
} from 'features/track-correction/track-selection.selectors'
import TrackSlider from 'features/track-correction/TrackSlider'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { useGetVesselInfoByDataviewId } from 'features/vessel/vessel.hooks'
import { getVesselProperty } from 'features/vessel/vessel.utils'
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
            features: trackCorrectionSegments.flatMap((segment) => {
              if (!segment.length) return []
              return segment.map((point) => {
                return {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [point.longitude, point.latitude],
                  },
                } as Feature<Point>
              })
            }),
          })

          const issueId = Date.now().toString()

          const issueBody: TrackCorrection = {
            issueId,
            vesselId: trackCorrectionVesselDataviewId.replace('vessel-', ''),
            vesselName: vesselInfo ? getVesselShipNameLabel(vesselInfo) : dataview?.config?.name,
            startDate: trackCorrectionTimerange.start,
            endDate: trackCorrectionTimerange.end,
            type: issueType,
            lastUpdated: new Date().toISOString(),
            resolved: isResolved,
            lon: middlePoint.geometry.coordinates[0],
            lat: middlePoint.geometry.coordinates[1],
          }

          const commentBody = {
            issueId,
            user: (userData?.firstName || '') + ' ' + (userData?.lastName || '') || 'Anonymous',
            date: new Date().toISOString(),
            comment: issueComment || 'No comment provided',
            datasetVersion: 1,
            marksAsResolved: isResolved,
          }

          dispatch(
            createNewIssueThunk({
              issueBody,
              commentBody,
              workspaceId,
            })
          )
        } else if (currentTrackCorrectionIssue) {
          const issueId = currentTrackCorrectionIssue?.issueId
          if (!issueId) {
            console.error('No issueId found for the current track correction issue.')
            return
          }
          const commentBody = {
            issueId,
            user: (userData?.firstName || '') + ' ' + (userData?.lastName || '') || 'Anonymous',
            date: new Date().toISOString(),
            comment: issueComment || 'No comment provided',
            datasetVersion: 1,
            marksAsResolved: isResolved,
          }
          dispatch(
            createCommentThunk({
              issueId,
              commentBody,
              workspaceId,
            })
          )
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
      issueType,
      isResolved,
      userData?.firstName,
      userData?.lastName,
      issueComment,
      dispatch,
    ]
  )

  return (
    <div className={styles.container}>
      {isNewTrackCorrection ? (
        <>
          <div>
            <label>{t('common.vessel', 'Vessel')}</label>
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
                <label>{t('common.flag', 'Flag')}</label>
                {getVesselProperty(vesselInfo, 'flag')}
              </div>
              <div>
                <label>{t('common.shiptype', 'Shiptype')}</label>
                {getVesselShipTypeLabel({ shiptypes: getVesselProperty(vesselInfo, 'shiptypes') })}
              </div>
              <div>
                <label>{t('common.geartype', 'Geartype')}</label>
                {getVesselGearTypeLabel({ geartypes: getVesselProperty(vesselInfo, 'geartypes') })}
              </div>
            </div>
          )}
          <label>{t('common.timeRange', 'Time range')}</label>
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
            <span>
              {t(
                'trackCorrection.adjustDisclaimer',
                'Adjust your time range to cover as precisely as possible the activity you are reporting on.'
              )}
            </span>
          </div>
          <div>
            <label>{t('trackCorrection.issueType', 'Type of issue')}</label>
            <Choice
              options={issueTypesOptions}
              activeOption={issueType}
              onSelect={(option) => {
                setTrackIssueType(option.id)
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
                {currentTrackCorrectionIssue.vesselName ||
                  (vesselInfo && getVesselShipNameLabel(vesselInfo)) ||
                  dataview?.config?.name}{' '}
                {' - '} {currentTrackCorrectionIssue.issueId}
              </h2>
              <h2>
                {t(
                  `trackCorrection.${currentTrackCorrectionIssue.type}`,
                  currentTrackCorrectionIssue.type
                )}
              </h2>
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
      <div>
        <label>{t('trackCorrection.comment', 'Comment')}</label>
        <InputText
          inputSize="small"
          placeholder={
            isNewTrackCorrection
              ? t('trackCorrection.commentPlaceholder', 'Add a comment...')
              : t('trackCorrection.replyPlaceholder', 'Write a reply')
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
            t('trackCorrection.version', 'Version') + ' 1'
            /*vesselInfo.datasetVersion*/
          }
        </span>
        <IconButton icon="language" type="border" onClick={() => setIsResolved(true)} />

        <Button
          tooltip={
            isNewTrackCorrection && isTimerangePristine
              ? t('common.adjustDisabled', 'Adjusting the time range is needed.')
              : undefined
          }
          disabled={
            (isNewTrackCorrection && isTimerangePristine) || issueComment === '' || isSubmitting
          }
          onClick={() => onConfirmClick(trackCorrectionTimerange)}
          loading={isSubmitting}
        >
          {t('common.confirm', 'Confirm')}
        </Button>
      </div>
    </div>
  )
}

export default TrackCorrection
