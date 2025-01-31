import { useTranslation } from 'react-i18next'
import { useGetVesselEventsQuery } from 'queries/vessel-events-api'

import type { RegionType } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'

import VesselEvent from 'features/vessel/activity/event/Event'

import styles from './VGRInsights.module.css'

const VesselGroupReportInsightVesselEvents = ({
  ids,
  vesselId,
  datasetId,
  start,
  end,
  regionsPriority,
}: {
  ids?: string[]
  vesselId: string
  datasetId: string
  start: string
  end: string
  regionsPriority?: RegionType[]
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
        <VesselEvent
          key={event.id}
          event={event}
          className={styles.event}
          regionsPriority={regionsPriority}
        />
      ))}
    </ul>
  )
}

export default VesselGroupReportInsightVesselEvents
