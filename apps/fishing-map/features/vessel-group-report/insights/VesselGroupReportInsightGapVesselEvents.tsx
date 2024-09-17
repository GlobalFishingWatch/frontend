import { useGetVesselEventsQuery } from 'queries/vessel-events-api'
import { Spinner } from '@globalfishingwatch/ui-components'
import VesselEvent from 'features/vessel/activity/event/Event'
import styles from './VesselGroupReportInsight.module.css'

const VesselGroupReportInsightGapVesselEvents = ({
  vesselId,
  datasetId,
  start,
  end,
}: {
  vesselId: string
  datasetId: string
  start: string
  end: string
}) => {
  const { data, isLoading } = useGetVesselEventsQuery({
    vessels: [vesselId],
    datasets: [datasetId],
    'start-date': start,
    'end-date': end,
  })
  if (isLoading) {
    return <Spinner size="small" />
  }
  if (!data?.entries) {
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

export default VesselGroupReportInsightGapVesselEvents
