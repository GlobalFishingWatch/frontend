import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useGetVesselEventsQuery } from 'queries/vessel-events-api'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import { getVesselIdentities } from 'features/vessel/vessel.utils'

import InsightError from './InsightErrorMessage'
import LonglineSetsGraph from './LonglineSetsGraph'

import styles from './Insights.module.css'

export const LONGLINE_FISHING_EVENTS_DATASET = 'public-global-longline-fishing-events:v4.0'

const InsightLongline = () => {
  const { t } = useTranslation()
  const { start, end } = useSelector(selectTimeRange)
  const vessel = useSelector(selectVesselInfoData)
  const identities = getVesselIdentities(vessel, {
    identitySource: VesselIdentitySourceEnum.SelfReported,
  })

  const { data, isFetching, error } = useGetVesselEventsQuery(
    {
      vessels: identities?.map((i) => i.id),
      datasets: [LONGLINE_FISHING_EVENTS_DATASET],
      'start-date': start,
      'end-date': end,
    },
    { skip: !identities?.length }
  )

  return (
    <div id="longline" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label>{t((t) => t.vessel.insights.longline)}</label>
      </div>
      {error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : isFetching || !data ? (
        <LonglineSetsGraph loading />
      ) : data.length === 0 ? (
        <p className={styles.secondary}>{t((t) => t.vessel.insights.longlineEventsEmpty)}</p>
      ) : (
        <LonglineSetsGraph data={data} />
      )}
    </div>
  )
}

export default InsightLongline
