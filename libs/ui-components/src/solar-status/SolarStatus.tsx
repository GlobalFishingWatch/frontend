import { useMemo } from 'react'
import cx from 'classnames'
import suncalc from 'suncalc'

import { Locale } from '@globalfishingwatch/api-types'

import { Icon, type IconType } from '../icon'
import { Tooltip } from '../tooltip'

import styles from './SolarStatus.module.css'

const { getTimes } = suncalc

interface SolarStatusProps {
  lat: number
  lon: number
  /**
   * UTC timestamp in milliseconds
   */
  timestamp: number
  locale?: Locale
  className?: string
}

interface SolarPhase {
  label: string
  icon: IconType
}

const STATUS_LABELS: Record<Locale, { day: string; night: string; dawn: string; dusk: string }> = {
  [Locale.en]: {
    day: 'Day',
    night: 'Night',
    dawn: 'Between nautical dawn and sunrise',
    dusk: 'Between sunset and nautical dusk',
  },
  [Locale.es]: {
    day: 'Día',
    night: 'Noche',
    dawn: 'Entre el amanecer náutico y la salida del sol',
    dusk: 'Entre la puesta del sol y el crepúsculo náutico',
  },
  [Locale.fr]: {
    day: 'Jour',
    night: 'Nuit',
    dawn: "Entre l'aube nautique et le lever du soleil",
    dusk: 'Entre le coucher du soleil et le crépuscule nautique',
  },
  [Locale.id]: {
    day: 'Siang',
    night: 'Malam',
    dawn: 'Antara fajar nautika dan matahari terbit',
    dusk: 'Antara matahari terbenam dan senja nautika',
  },
  [Locale.pt]: {
    day: 'Dia',
    night: 'Noite',
    dawn: 'Entre o amanhecer náutico e o nascer do sol)',
    dusk: 'Entre o pôr do sol e o crepúsculo náutico)',
  },
}

export function SolarStatus({
  lat,
  lon,
  timestamp,
  locale = Locale.en,
  className,
}: SolarStatusProps) {
  const solarPhase = useMemo((): SolarPhase | undefined => {
    if (typeof lat !== 'number' || typeof lon !== 'number' || !timestamp) {
      return
    }

    const date = new Date(timestamp)
    const times = getTimes(date, lat, lon)
    const nDawn = times.nauticalDawn.getTime()
    const sRise = times.sunrise.getTime()
    const sSet = times.sunset.getTime()
    const nDusk = times.nauticalDusk.getTime()

    const labels = STATUS_LABELS[locale] || STATUS_LABELS[Locale.en]

    // 1. Day: Sun is above the horizon
    if (timestamp >= sRise && timestamp <= sSet) {
      return { label: labels.day, icon: 'solar-status-day' }
    }

    // 2. During Dawn: Between nautical dawn and sunrise
    if (timestamp >= nDawn && timestamp < sRise) {
      return { label: labels.dawn, icon: 'solar-status-dawn' }
    }

    // 3. During Dusk: Between sunset and nautical dusk
    if (timestamp > sSet && timestamp <= nDusk) {
      return { label: labels.dusk, icon: 'solar-status-dusk' }
    }

    // 4. Night: Outside the nautical twilight window
    return { label: labels.night, icon: 'solar-status-night' }
  }, [lat, lon, timestamp, locale])

  return (
    solarPhase && (
      <Tooltip content={solarPhase.label}>
        <span>
          <Icon icon={solarPhase.icon} className={cx(styles.icon, className)} />
        </span>
      </Tooltip>
    )
  )
}
