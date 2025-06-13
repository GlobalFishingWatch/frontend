import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { center } from '@turf/center'
import type { Feature, Point } from 'geojson'

import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Button, Choice, Icon, InputText, Select } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectActiveTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import type { IssueType } from 'features/track-correction/track-correction.slice'
import {
  resetTrackCorrection,
  selectTrackCorrectionState,
  selectTrackCorrectionTimerange,
  selectTrackCorrectionVesselDataviewId,
  selectTrackIssueType,
  setTrackCorrectionDataviewId,
  setTrackIssueComment,
  setTrackIssueType,
} from 'features/track-correction/track-correction.slice'
import { selectIsNewTrackCorrection } from 'features/track-correction/track-selection.selectors'
import TrackSlider from 'features/track-correction/TrackSlider'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { useGetVesselInfoByDataviewId } from 'features/vessel/vessel.hooks'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import FitBounds from 'features/workspace/shared/FitBounds'
import { getVesselGearTypeLabel, getVesselShipNameLabel, getVesselShipTypeLabel } from 'utils/info'

import styles from './TrackCorrection.module.css'

const issueTypesOptions: ChoiceOption<IssueType>[] = [
  { id: 'falsePositive', label: 'False positive' },
  { id: 'falseNegative', label: 'False negative' },
  { id: 'other', label: 'Other' },
]

function VesselOptionsSelect() {
  const dispatch = useAppDispatch()
  const trackDataviews = useSelector(selectActiveTrackDataviews)
  const vesselOptions = useMemo(() => {
    return trackDataviews.map((dataview) => ({
      id: dataview.id,
      label: (
        <span className={styles.vesselLabel}>
          <Icon icon="vessel" style={{ color: dataview.config?.color }} />
          {dataview.config?.name}
        </span>
      ),
      color: dataview.config?.color,
    }))
  }, [trackDataviews])

  useEffect(() => {
    if (vesselOptions.length === 1) {
      dispatch(setTrackCorrectionDataviewId(vesselOptions[0].id))
    }
  }, [dispatch, vesselOptions])

  return (
    <Select
      options={vesselOptions}
      containerClassName={styles.vesselSelect}
      onSelect={(option) => dispatch(setTrackCorrectionDataviewId(option.id))}
    />
  )
}

const TrackCorrection = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { start, end } = useSelector(selectTimeRange)
  const issueType = useSelector(selectTrackCorrectionState)
  const isNewTrackCorrection = useSelector(selectIsNewTrackCorrection)
  const [isTimerangePristine, setIsTimerangePristine] = useState(true)

  const trackCorrectionVesselDataviewId = useSelector(selectTrackCorrectionVesselDataviewId)
  const trackCorrectionTimerange = useSelector(selectTrackCorrectionTimerange)
  const { dataview, vesselInfoResource, vesselLayer } = useGetVesselInfoByDataviewId(
    trackCorrectionVesselDataviewId
  )
  const vesselInfo = vesselInfoResource?.data
  const vesselColor = dataview?.config?.color
  console.log('🚀 initial state:', issueType)
  const userData = useSelector(selectUserData)

  useEffect(() => {
    if (trackCorrectionVesselDataviewId) {
      setIsTimerangePristine(true)
    }
  }, [trackCorrectionVesselDataviewId])

  useEffect(() => {
    return () => {
      dispatch(resetTrackCorrection())
    }
  }, [dispatch])

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
    (trackCorrectionTimerange: { start: string; end: string }) => {
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
      console.log('🚀 ~ TrackCorrection ~ middlePoint:', middlePoint)
    },
    [vesselLayer?.instance]
  )

  return (
    <div className={styles.container}>
      <div>
        <label>{t('common.vessel', 'Vessel')}</label>
        <div className={styles.vessel}>
          {isNewTrackCorrection && trackCorrectionVesselDataviewId ? (
            <span className={styles.vesselLabel}>
              <Icon icon="vessel" style={{ color: vesselColor }} />
              {vesselInfo ? getVesselShipNameLabel(vesselInfo) : dataview?.config?.name}
            </span>
          ) : (
            <VesselOptionsSelect />
          )}
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
          activeOption={issueType.newIssue.type}
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
