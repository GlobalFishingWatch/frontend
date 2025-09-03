import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'

import { Button, Icon, InputText } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import I18nDate from 'features/i18n/i18nDate'
import {
  createCommentThunk,
  fetchTrackIssuesThunk,
  selectTrackCorrectionVesselDataviewId,
  selectTrackIssueComment,
  setTrackIssueComment,
} from 'features/track-correction/track-correction.slice'
import { selectCurrentTrackCorrectionIssue } from 'features/track-correction/track-selection.selectors'
import { selectIsGuestUser, selectUserData } from 'features/user/selectors/user.selectors'
import { useGetVesselInfoByDataviewId } from 'features/vessel/vessel.hooks'
import { selectCurrentWorkspaceId } from 'features/workspace/workspace.selectors'
import { getVesselShipNameLabel } from 'utils/info'

import TrackCommentsList from './TrackCommentsList'

import styles from './TrackCorrection.module.css'

enum ActionType {
  Resolve = 'resolve',
  Confirm = 'confirm',
  Comment = 'comment',
}

const TrackCorrectionEdit = () => {
  const { t } = useTranslation()
  const issueComment = useSelector(selectTrackIssueComment)
  const dispatch = useAppDispatch()
  const isGuestUser = useSelector(selectIsGuestUser)

  const workspaceId = useSelector(selectCurrentWorkspaceId)

  const currentTrackCorrectionIssue = useSelector(selectCurrentTrackCorrectionIssue)
  const [isCommenting, setIsCommenting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const trackCorrectionVesselDataviewId = useSelector(selectTrackCorrectionVesselDataviewId)
  const { dataview, vesselInfoResource } = useGetVesselInfoByDataviewId(
    trackCorrectionVesselDataviewId
  )
  const vesselInfo = vesselInfoResource?.data
  const userData = useSelector(selectUserData)

  const buildCommentBody = useCallback(
    (issueId: string, action: ActionType) => ({
      issueId,
      user: (userData?.firstName || '') + ' ' + (userData?.lastName || '') || 'Anonymous',
      userEmail: userData?.email || '',
      date: new Date().toISOString(),
      comment:
        issueComment !== ''
          ? issueComment
          : action === ActionType.Confirm
            ? 'Confirmed'
            : action === ActionType.Resolve
              ? 'Resolved'
              : 'No comment provided',
      datasetVersion: 1,
      marksAsResolved: action === ActionType.Resolve,
      confirmed: action === ActionType.Confirm,
    }),
    [userData, issueComment]
  )

  const onConfirmClick = useCallback(
    async (action: ActionType) => {
      try {
        if (action === ActionType.Comment) {
          setIsCommenting(true)
        } else {
          setIsSubmitting(true)
        }
        if (currentTrackCorrectionIssue && workspaceId) {
          const issueId = currentTrackCorrectionIssue?.issueId
          if (!issueId) {
            console.error('No issueId found for the current track correction issue.')
            return
          }

          const commentBody = buildCommentBody(issueId, action)

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
        if (action === ActionType.Comment) {
          setIsCommenting(false)
        } else {
          setIsSubmitting(false)
        }
      }
    },
    [currentTrackCorrectionIssue, workspaceId, buildCommentBody, dispatch]
  )

  if (isGuestUser || !userData || !currentTrackCorrectionIssue) return null

  return (
    <Fragment>
      <h1 className={styles.title}>
        {t('trackCorrection.issue', {
          issueId: currentTrackCorrectionIssue.issueId,
        })}
      </h1>
      <div className={styles.container}>
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
        <TrackCommentsList track={currentTrackCorrectionIssue} />
        {!currentTrackCorrectionIssue.resolved && (
          <div className={styles.commentContainer}>
            <div>
              <InputText
                inputSize="small"
                placeholder={t('trackCorrection.replyPlaceholder')}
                value={issueComment}
                className={styles.input}
                onChange={(e) => {
                  dispatch(setTrackIssueComment(e.target.value))
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    onConfirmClick(ActionType.Comment)
                  }
                }}
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
              {!isGuestUser && (
                <div className={styles.actions}>
                  <Fragment>
                    <Button
                      size="medium"
                      className={styles.commentButton}
                      onClick={() => onConfirmClick(ActionType.Comment)}
                      loading={isCommenting}
                      disabled={!issueComment}
                      tooltip={!issueComment && t('trackCorrection.commentRequired')}
                    >
                      {t('trackCorrection.comment')}
                    </Button>
                    {currentTrackCorrectionIssue.confirmed ? (
                      <Button
                        size="medium"
                        className={styles.commentButton}
                        onClick={() => onConfirmClick(ActionType.Resolve)}
                        loading={isSubmitting}
                        tooltip={t('trackCorrection.resolveAndClose')}
                      >
                        <Icon icon={'tick'} />
                        {t('trackCorrection.commentResolve')}
                      </Button>
                    ) : (
                      <Button
                        size="medium"
                        className={styles.commentButton}
                        onClick={() => onConfirmClick(ActionType.Confirm)}
                        loading={isSubmitting}
                        disabled={currentTrackCorrectionIssue?.confirmed}
                        tooltip={
                          t('trackCorrection.confirmAs') +
                          ' ' +
                          t(`trackCorrection.${currentTrackCorrectionIssue.type}`).toLowerCase()
                        }
                      >
                        <Icon icon={'tick'} />
                        {t('trackCorrection.confirm')}
                      </Button>
                    )}
                  </Fragment>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Fragment>
  )
}

export default TrackCorrectionEdit
