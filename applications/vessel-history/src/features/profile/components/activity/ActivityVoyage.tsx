import { Fragment, useMemo } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { Voyage } from 'features/vessels/voyages/voyages.selectors'
import styles from './Activity.module.css'

export interface RenderedVoyage extends Voyage {
  status: 'collapsed' | 'expanded'
}

interface EventProps {
  event: RenderedVoyage
  onMapClick?: (event: RenderedVoyage) => void
  onToggleClick?: (event: RenderedVoyage) => void
}

const ActivityVoyage: React.FC<EventProps> = ({
  event,
  onMapClick = () => {},
  onToggleClick = () => {},
}): React.ReactElement => {
  const { t } = useTranslation()

  const voyageLabel = useMemo(() => {
    const parts: string[] = []

    if (event.from) {
      parts.push(
        `${t('common.from', 'from')} ${formatI18nDate(event.start ?? 0, {
          format: DateTime.DATETIME_FULL,
        })}`
      )
    }
    if (event.to) {
      parts.push(
        `${t('common.to', 'to')} ${formatI18nDate(event.end ?? 0, {
          format: DateTime.DATETIME_FULL,
        })}`
      )
    } else {
      parts.splice(0, 0, t('event.currentVoyage' as any, 'Current Voyage') as string)
    }

    return parts.join(' - ')
  }, [event.from, event.start, event.to, event.end, t])

  return (
    <Fragment>
      <div className={styles.event}>
        <div className={styles.eventData}>
          <div className={styles.description}>{voyageLabel}</div>
        </div>
        <div className={styles.actions}>
          <IconButton
            icon={event.status === 'expanded' ? 'arrow-top' : 'arrow-down'}
            size="small"
            onClick={() => onToggleClick(event)}
          ></IconButton>
          <IconButton
            icon="view-on-map"
            size="small"
            onClick={() => onMapClick(event)}
          ></IconButton>
        </div>
      </div>
      <div className={styles.divider}></div>
    </Fragment>
  )
}

export default ActivityVoyage
