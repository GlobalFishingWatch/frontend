import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { center } from '@turf/center'
import { dispatch } from 'd3'
import type { Feature, Point } from 'geojson'
import { DateTime } from 'luxon'

import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Button, Choice, Icon, InputText, Select } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectActiveTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import I18nDate from 'features/i18n/i18nDate'
import type { IssueType, TrackCorrection } from 'features/track-correction/track-correction.slice'
import {
  resetTrackCorrection,
  selectTrackCorrectionState,
  selectTrackCorrectionTimerange,
  selectTrackCorrectionVesselDataviewId,
  selectTrackIssueComment,
  selectTrackIssueType,
  setTrackCorrectionDataviewId,
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

import styles from './TrackCorrection.module.css'

const issueTypesOptions: ChoiceOption<IssueType>[] = [
  { id: 'falsePositive', label: 'False positive' },
  { id: 'falseNegative', label: 'False negative' },
  { id: 'other', label: 'Other' },
]

// function VesselOptionsSelect() {
//   const dispatch = useAppDispatch()
//   const trackDataviews = useSelector(selectActiveTrackDataviews)
//   const vesselOptions = useMemo(() => {
//     return trackDataviews.map((dataview) => ({
//       id: dataview.id,
//       label: (
//         <span className={styles.vesselLabel}>
//           <Icon icon="vessel" style={{ color: dataview.config?.color }} />
//           {dataview.config?.name}
//         </span>
//       ),
//       color: dataview.config?.color,
//     }))
//   }, [trackDataviews])

//   useEffect(() => {
//     if (vesselOptions.length === 1) {
//       dispatch(setTrackCorrectionDataviewId(vesselOptions[0].id))
//     }
//   }, [dispatch, vesselOptions])

//   return (
//     <Select
//       options={vesselOptions}
//       containerClassName={styles.vesselSelect}
//       onSelect={(option) => dispatch(setTrackCorrectionDataviewId(option.id))}
//     />
//   )
// }

const TrackCorrection = () => {
  const { t } = useTranslation()
  const { start, end } = useSelector(selectTimeRange)
  const issueType = useSelector(selectTrackIssueType)
  const issueComment = useSelector(selectTrackIssueComment)

  const currentWorkspaceId = useSelector(selectCurrentWorkspaceId)

  const isNewTrackCorrection = useSelector(selectIsNewTrackCorrection)
  const currentTrackCorrectionIssue = useSelector(selectCurrentTrackCorrectionIssue)
  const [isTimerangePristine, setIsTimerangePristine] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

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
        setSubmitError('')

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

        const issueId = `issue_${Date.now()}_${Math.random().toString(36).substring(2, 9)}` // Generate a unique issue ID

        const issueBody: TrackCorrection = {
          issueId,
          vesselId: trackCorrectionVesselDataviewId,
          startDate: trackCorrectionTimerange.start,
          endDate: trackCorrectionTimerange.end,
          type: issueType,
          lastUpdated: Date.now().toString(),
          resolved: false,
          longitude: middlePoint.geometry.coordinates[0],
          latitude: middlePoint.geometry.coordinates[1],
        }

        const commentBody = {
          issueId,
          user: issueComment || 'No comment provided',
          datasetVersion: 1,
          marksAsResolved: false,
        }

        const response = await fetch(`/api/track-corrections/${currentWorkspaceId}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            issueBody,
            commentBody,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to submit track correction')
        }

        // Handle successful response
        const data = await response.json()
        console.log('Track correction submitted successfully:', data)

        // dispatch(resetTrackCorrection())
      } catch (error) {
        console.error('Error submitting track correction:', error)
        setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred')
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      vesselLayer?.instance,
      trackCorrectionVesselDataviewId,
      issueType,
      issueComment,
      currentWorkspaceId,
    ]
  )
  return (
    <div className={styles.container}>
      <div>
        <label>{t('common.vessel', 'Vessel')}</label>
        <div className={styles.vessel}>
          <span className={styles.vesselLabel}>
            <Icon icon="vessel" style={{ color: vesselColor }} />
            {vesselInfo ? getVesselShipNameLabel(vesselInfo) : dataview?.config?.name}
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

      <div>
        <label>{t('trackCorrection.comment', 'Comment')}</label>
        <InputText
          inputSize="small"
          className={styles.input}
          onChange={(e) => setTrackIssueComment(e.target.value)}
          // disabled={loading}
        />
      </div>

      <div className={styles.actions}>
        <Button
          tooltip={
            isTimerangePristine
              ? t('common.adjustDisabled', 'Adjusting the time range is needed.')
              : undefined
          }
          disabled={isTimerangePristine}
          onClick={() => onConfirmClick(trackCorrectionTimerange)}
        >
          {t('common.confirm', 'Confirm')}
        </Button>
      </div>
    </div>
  )
}

export default TrackCorrection
