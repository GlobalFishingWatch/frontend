import { useSelector } from 'react-redux'
import { useGetVesselInsightMutation } from 'queries/vessel-insight-api'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'
import { getVesselIdentities } from 'features/vessel/vessel.utils'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import InsightCoverage from './InsightCoverage'
import InsightFishing from './InsightFishing'
import InsightGaps from './InsightGaps'
import InsightIdentity from './InsightIdentity'
import InsightIUU from './InsightIUU'
import {
  InsightCoverageResponse,
  InsightFishingResponse,
  InsightGapsResponse,
  InsightIdentityResponse,
  InsightResponse,
} from './insights.types'

const InsightWrapper = ({ insight }: { insight: string }) => {
  const { start, end } = useSelector(selectTimeRange)
  const vessel = useSelector(selectVesselInfoData)
  const [getInsight, { isLoading, data }] = useGetVesselInsightMutation()

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
      await getInsight(params).unwrap()
    } catch (error) {
      console.error('rejected', error)
    }
  }, [end, getInsight, insight, start, vessel])

  useEffect(() => {
    callInsight()
  }, [callInsight])

  if (insight === 'COVERAGE') {
    return <InsightCoverage isLoading={isLoading} insightData={data as InsightCoverageResponse} />
  }
  if (insight === 'VESSEL-IDENTITY') {
    return (
      <Fragment>
        <InsightIUU isLoading={isLoading} insightData={data as InsightIdentityResponse} />
        <InsightIdentity isLoading={isLoading} insightData={data as InsightIdentityResponse} />
      </Fragment>
    )
  }
  if (insight === 'GAP') {
    return <InsightGaps isLoading={isLoading} insightData={data as InsightGapsResponse} />
  }
  if (insight === 'FISHING') {
    return <InsightFishing isLoading={isLoading} insightData={data as InsightFishingResponse} />
  }
}

export default InsightWrapper
