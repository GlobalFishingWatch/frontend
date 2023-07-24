import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { eventsToBbox } from '@globalfishingwatch/data-transforms'
import { selectTimeRange } from 'features/app/app.selectors'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { selectVesselEventsFilteredByTimerange } from 'features/vessel/vessel.selectors'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { formatInfoField } from 'utils/info'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { selectVoyagesNumber } from 'features/vessel/activity/vessels-activity.selectors'
import styles from './VesselSummary.module.css'

const VesselSummary = () => {
  const { t } = useTranslation()
  const vessel = useSelector(selectVesselInfoData)
  const events = useSelector(selectVesselEventsFilteredByTimerange)
  const voyages = useSelector(selectVoyagesNumber)
  const timerange = useSelector(selectTimeRange)
  const fitBounds = useMapFitBounds()

  const summary = t('vessel.summary', {
    defaultValue:
      'The <strong>{{vesselType}}</strong> vessel flagged by <strong>{{vesselFlag}}</strong> {{events}} {{voyages}} between <strong>{{timerangeStart}}</strong> and <strong>{{timerangeEnd}}</strong>.',
    vesselType: formatInfoField(vessel?.shiptype as string, 'vesselType').toLowerCase(),
    vesselFlag: formatInfoField(vessel?.flag as string, 'flag'),
    events: `${t('common.had', 'had')} <strong>${formatI18nNumber(
      events?.length as number
    )}</strong> ${t('common.event', { defaultValue: 'events', count: events?.length })}`,
    voyages:
      voyages !== 0
        ? `${t('common.in', 'in')} <strong>${formatI18nNumber(voyages as number)}</strong> ${t(
            'vessel.voyage',
            { defaultValue: 'voyages', count: voyages }
          )}`
        : '',
    timerangeStart: formatI18nDate(timerange?.start),
    timerangeEnd: formatI18nDate(timerange?.end),
  })

  const onVesselFitBoundsClick = () => {
    const bounds = eventsToBbox(events)
    fitBounds(bounds)
  }

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>{formatInfoField(vessel!?.shipname, 'name')}</h1>
        <IconButton
          icon="target"
          size="small"
          disabled={!events?.length}
          onClick={onVesselFitBoundsClick}
        />
      </div>
      <h2 className={styles.summary} dangerouslySetInnerHTML={{ __html: summary }}></h2>
      <div className={styles.actionsContainer}>
        {/* TODO: get info and track datasets for vessel */}
        <VesselGroupAddButton
          buttonSize="small"
          buttonType="border-secondary"
          vessels={[vessel as any]}
          showCount={false}
        />
      </div>
    </div>
  )
}

export default VesselSummary
