import { useGetVesselEventsQuery } from 'queries/vessel-events-api'
import { Spinner } from '@globalfishingwatch/ui-components'

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
  console.log('🚀 ~ data:', data)
  return <span>TODO: show GAP events</span>
}

export default VesselGroupReportInsightGapVesselEvents
