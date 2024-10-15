import { useGetVesselEventsQuery } from 'queries/vessel-events-api'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@globalfishingwatch/ui-components'
import VesselEvent from 'features/vessel/activity/event/Event'
import styles from './VGRInsights.module.css'

const VesselGroupReportInsightVesselEvents = ({
  ids,
  vesselId,
  datasetId,
  start,
  end,
}: {
  ids?: string[]
  vesselId: string
  datasetId: string
  start: string
  end: string
}) => {
  const { t } = useTranslation()
  const { data, isLoading, error } = useGetVesselEventsQuery(
    {
      vessels: [vesselId],
      ...(ids && { ids: ids }),
      datasets: [datasetId],
      'start-date': start,
      'end-date': end,
    },
    { skip: !ids && !vesselId }
  )

  if (isLoading) {
    return <Spinner size="small" />
  } else if (error) {
    return (
      <p className={styles.secondary}>
        {t(
          'vesselGroupReport.insights.fishingEventsError',
          'There was an error loading the fishing events'
        )}
      </p>
    )
  } else if (!data?.entries) {
    return null
  }

  return (
    <ul className={styles.eventDetailsList}>
      {data.entries.map((event) => (
        <VesselEvent key={event.id} event={event} className={styles.event} />
      ))}
    </ul>
  )
}

export default VesselGroupReportInsightVesselEvents
