import React from 'react'
import { DateTime, DateTimeFormatOptions } from 'luxon'
import { ScaleControl } from '@globalfishingwatch/react-map-gl'
import { InteractionEvent } from '@globalfishingwatch/react-hooks'
import { toFixed } from 'utils/shared'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import useViewport from 'features/map/map-viewport.hooks'
import I18nDate from 'features/i18n/i18nDate'
import styles from './MapInfo.module.css'

export const pickDateFormatByRange = (start: string, end: string): DateTimeFormatOptions => {
  const A_DAY = 1000 * 60 * 60 * 24
  const timeΔ = start && end ? new Date(end).getTime() - new Date(start).getTime() : 0
  return timeΔ < A_DAY ? DateTime.DATETIME_MED : DateTime.DATE_MED
}

export const TimelineDatesRange = () => {
  const { start, end } = useTimerangeConnect()
  const dateFormat = pickDateFormatByRange(start, end)
  if (!start || !end) return null
  return (
    <div>
      <I18nDate date={start} format={dateFormat} /> -
      <I18nDate date={end} format={dateFormat} />
    </div>
  )
}

const MapInfo = ({ center }: { center: InteractionEvent | null }) => {
  const { viewport } = useViewport()
  const { zoom } = viewport
  return (
    <div className={styles.info}>
      <div className={styles.scale}>
        {zoom > 2 && <ScaleControl maxWidth={100} unit="nautical" />}
      </div>
      {center && (
        <div className="print-hidden">
          {toFixed(center.latitude, 4)} {toFixed(center.longitude, 4)}
        </div>
      )}
      <TimelineDatesRange />
    </div>
  )
}

export default MapInfo
