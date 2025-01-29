import { DateTime } from 'luxon'

import { Tooltip } from '@globalfishingwatch/ui-components'

import { t } from 'features/i18n/i18n'
import I18nDate from 'features/i18n/i18nDate'
import TimeRangeDates from 'features/map/controls/TimeRangeDates'
import type { ExtendedFeatureVessel } from 'features/map/map.slice'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { getUTCDateTime } from 'utils/dates'
import { getDetectionsTimestamps } from 'utils/info'

import styles from './VesselsTable.module.css'

export const VesselDetectionTimestamps = ({ vessel }: { vessel: ExtendedFeatureVessel }) => {
  const { setTimerange } = useTimerangeConnect()
  const detectionsTimestamps = getDetectionsTimestamps(vessel)
  const hasDetectionsTimestamps = detectionsTimestamps && detectionsTimestamps.length > 0
  const hasMultipleDetectionsTimestamps = hasDetectionsTimestamps && detectionsTimestamps.length > 1

  const start = hasDetectionsTimestamps
    ? (getUTCDateTime(detectionsTimestamps[0]).startOf('day').toISO() as string)
    : ''

  const end = hasDetectionsTimestamps
    ? (getUTCDateTime(detectionsTimestamps[detectionsTimestamps.length - 1])
        .endOf('day')
        .toISO() as string)
    : ''

  if (!hasDetectionsTimestamps) return null

  return hasMultipleDetectionsTimestamps ? (
    <Tooltip content={t('timebar.fitOnThisDates', 'Fit time range to these dates') as string}>
      <button
        className={styles.timestampBtn}
        onClick={() => {
          setTimerange({
            start,
            end,
          })
        }}
      >
        (<TimeRangeDates start={start} end={end} format={DateTime.DATE_MED} />)
      </button>
    </Tooltip>
  ) : (
    <Tooltip content={t('timebar.focusOnThisDay', 'Focus time range on this day')}>
      <button
        className={styles.timestampBtn}
        onClick={() => {
          setTimerange({
            start,
            end: getUTCDateTime(start).endOf('day').toISO() as string,
          })
        }}
      >
        (<I18nDate date={start} />)
      </button>
    </Tooltip>
  )
}

export default VesselDetectionTimestamps
