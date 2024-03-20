import { useSelector } from 'react-redux'
import { useGetVesselInsightMutation } from 'queries/vessel-insight-api'
import { Fragment, useCallback, useEffect } from 'react'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getVesselIdentities } from 'features/vessel/vessel.utils'
import { IdentityVesselData, selectVesselInfoData } from 'features/vessel/vessel.slice'
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
} from './insights.types'

const InsightWrapper = ({ insight }: { insight: string }) => {
  const { start, end } = useSelector(selectTimeRange)
  const vessel = useSelector(selectVesselInfoData)

  const [getInsight, { isLoading, data }] = useGetVesselInsightMutation({
    fixedCacheKey: [insight, start, end, vessel.id].join(),
  })

  const callInsight = useCallback(
    async ({
      start,
      end,
      insight,
      vessel,
    }: {
      start: string
      end: string
      insight: string
      vessel: IdentityVesselData
    }) => {
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
        console.log('get insight', insight)

        await getInsight(params)
      } catch (error) {
        console.error('rejected', error)
      }
    },
    [getInsight]
  )

  useEffect(() => {
    callInsight({ start, end, insight, vessel })
  }, [callInsight, end, insight, start, vessel])

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
