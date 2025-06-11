import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { Button, Icon } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectTrackCorrectionVesselDataviewId } from 'features/track-correction/track-correction.slice'
import TrackSlider from 'features/track-correction/TrackSlider'
import { useGetVesselInfoByDataviewId } from 'features/vessel/vessel.hooks'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import FitBounds from 'features/workspace/shared/FitBounds'
import { getVesselGearTypeLabel, getVesselShipNameLabel, getVesselShipTypeLabel } from 'utils/info'

import styles from './TrackCorrection.module.css'

const TrackCorrection = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { start, end } = useSelector(selectTimeRange)
  const [isTimerangePristine, setIsTimerangePristine] = useState(true)

  const trackCorrectionVesselDataviewId = useSelector(selectTrackCorrectionVesselDataviewId)
  const { dataview, vesselInfoResource, vesselLayer } = useGetVesselInfoByDataviewId(
    trackCorrectionVesselDataviewId
  )
  const vesselInfo = vesselInfoResource?.data
  const vesselColor = dataview?.config?.color

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

  return (
    <div>
      <label>{t('common.vessel', 'Vessel')}</label>
      <div className={styles.vessel}>
        <span className={styles.vesselLabel}>
          <Icon icon="vessel" style={{ color: vesselColor }} />
          {vesselInfo ? getVesselShipNameLabel(vesselInfo) : dataview?.config?.name}
        </span>
        <FitBounds layer={vesselLayer?.instance} disabled={!vesselLayer.loaded} />
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
        startTime={getUTCDateTime(start).toMillis()}
        endTime={getUTCDateTime(end).toMillis()}
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
      <div className={styles.actions}>
        <Button
          tooltip={
            isTimerangePristine
              ? t('common.adjustDisabled', 'Adjusting the time range is needed.')
              : undefined
          }
          disabled={isTimerangePristine}
        >
          {t('common.confirm', 'Confirm')}
        </Button>
      </div>
    </div>
  )
}

export default TrackCorrection
