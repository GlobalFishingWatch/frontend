import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { Button, Icon, IconButton } from '@globalfishingwatch/ui-components'
import { selectTimeRange } from 'features/app/app.selectors'
import { selectVesselEventsFilteredByTimerange } from 'features/vessel/vessel.selectors'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { formatInfoField } from 'utils/info'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import styles from './VesselSummary.module.css'

const VesselSummary = () => {
  const { t } = useTranslation()
  const vessel = useSelector(selectVesselInfoData)
  const events = useSelector(selectVesselEventsFilteredByTimerange)
  const timerange = useSelector(selectTimeRange)

  const summary = useMemo(() => {
    return t('vessel.summary', {
      defaultValue:
        'The <strong>{{vesselType}}</strong> vessel flagged by <strong>{{vesselFlag}}</strong> had <strong>{{events}}</strong> events in <strong>{{voyages}}</strong> voyages between <strong>{{timerangeStart}}</strong> and <strong>{{timerangeEnd}}</strong>.',
      vesselType: formatInfoField(vessel?.vesselType as string, 'vesselType').toLowerCase(),
      vesselFlag: formatInfoField(vessel?.flag as string, 'flag'),
      events: formatI18nNumber(events?.length as number),
      voyages: 15, // TODO: calculate voyages
      timerangeStart: formatI18nDate(timerange?.start),
      timerangeEnd: formatI18nDate(timerange?.end),
    })
  }, [t, vessel?.vesselType, vessel?.flag, events?.length, timerange?.start, timerange?.end])

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>{formatInfoField(vessel!?.shipname, 'name')}</h1>
        <IconButton icon="target" size="small" />
      </div>
      <h2 className={styles.summary} dangerouslySetInnerHTML={{ __html: summary }}></h2>
      <div className={styles.actionsContainer}>
        {/* TODO: get info and track datasets for vessel */}
        <VesselGroupAddButton vessels={[vessel as any]} showCount={false} />
        {/* TODO: create download function */}
        <Button className={styles.actionButton}>
          {t('download.dataDownload', 'Download Data')} <Icon icon="download" />
        </Button>
      </div>
    </div>
  )
}

export default VesselSummary
