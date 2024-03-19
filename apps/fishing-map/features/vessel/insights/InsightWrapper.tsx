import { useSelector } from 'react-redux'
import { useGetVesselInsightMutation } from 'queries/vessel-insight-api'
import { useCallback, useEffect, useState } from 'react'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'
import { getVesselIdentities } from 'features/vessel/vessel.utils'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import InsightCoverage, { InsightCoverageResponse } from 'features/vessel/insights/InsightCoverage'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
type InsightProps = { insight: string }
type InsightResponse = InsightCoverageResponse

const InsightWrapper = ({ insight }: InsightProps) => {
  const { start, end } = useSelector(selectTimeRange)
  const vessel = useSelector(selectVesselInfoData)
  const [insightData, setInsightData] = useState<InsightResponse>()
  const [getInsight, { isLoading }] = useGetVesselInsightMutation()

  const callInsight = useCallback(async () => {
    const identities = getVesselIdentities(vessel, {
      identitySource: VesselIdentitySourceEnum.SelfReported,
    })
    const params = {
      vessels: identities.map((identity) => ({
        vesselId: identity.id,
        datasetId: vessel.dataset.id,
      })),
      includes: [insight],
      startDate: start,
      endDate: end,
    }
    try {
      const data = await getInsight(params).unwrap()
      setInsightData(data)
      console.log('fulfilled', data)
    } catch (error) {
      console.error('rejected', error)
    }
  }, [end, getInsight, insight, start, vessel])

  useEffect(() => {
    callInsight()
  }, [callInsight])

  if (isLoading) {
    return <Spinner size="tiny" />
  }
  if (insight === 'COVERAGE') {
    return <InsightCoverage insightData={insightData as InsightCoverageResponse} />
  }
}

export default InsightWrapper
