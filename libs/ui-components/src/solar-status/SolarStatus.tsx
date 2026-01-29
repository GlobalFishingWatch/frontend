import { useMemo } from 'react'
import cx from 'classnames'
import { getTimes } from 'suncalc'

import { Locale } from '@globalfishingwatch/api-types'
import { Tooltip } from '@globalfishingwatch/ui-components/tooltip'

import { Icon, type IconType } from '../icon'

import styles from './SolarStatus.module.css'

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
  [Locale.en]: { day: 'Day', night: 'Night', dawn: 'Dawn', dusk: 'Dusk' },
  [Locale.es]: {
    day: 'Día',
    night: 'Noche',
    dawn: 'Amanecer',
    dusk: 'Atardecer',
  },
  [Locale.fr]: {
    day: 'Jour',
    night: 'Nuit',
    dawn: 'Aube',
    dusk: 'Crépuscule',
  },
  [Locale.id]: { day: 'Siang', night: 'Malam', dawn: 'Fajar', dusk: 'Senja' },
  [Locale.pt]: {
    day: 'Dia',
    night: 'Noite',
    dawn: 'Amanhecer',
    dusk: 'Entardecer',
  },
}

export function SolarStatus({ lat, lon, timestamp, locale, className }: SolarStatusProps) {
  const solarPhase = useMemo((): SolarPhase | undefined => {
    // Basic validation
    if (typeof lat !== 'number' || typeof lon !== 'number' || !timestamp) {
      return
    }

    const date = new Date(timestamp)
    const times = getTimes(date, lat, lon)
    const nDawn = times.nauticalDawn.getTime()
    const sRise = times.sunrise.getTime()
    const sSet = times.sunset.getTime()
    const nDusk = times.nauticalDusk.getTime()

    const resolvedLocale = locale ?? Locale.en
    const labels = STATUS_LABELS[resolvedLocale]

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
