import { useSelector } from 'react-redux'
import { useGetVesselInsightMutation } from 'queries/vessel-insight-api'
import { useCallback, useEffect } from 'react'
import {
  InsightErrorResponse,
  InsightFlagChangesResponse,
  InsightIUUResponse,
  InsightMOUListResponse,
  VesselIdentitySourceEnum,
} from '@globalfishingwatch/api-types'
import {
  InsightCoverageResponse,
  InsightFishingResponse,
  InsightGapsResponse,
} from '@globalfishingwatch/api-types'
import { getVesselIdentities } from 'features/vessel/vessel.utils'
import { IdentityVesselData, selectVesselInfoData } from 'features/vessel/vessel.slice'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import InsightMOUList from 'features/vessel/insights/InsightMOUList'
import InsightCoverage from './InsightCoverage'
import InsightFishing from './InsightFishing'
import InsightGaps from './InsightGaps'
import InsightIUU from './InsightIUU'
import InsightFlagChanges from './InsightFlagChanges'

const InsightWrapper = ({ insight }: { insight: string }) => {
  const { start, end } = useSelector(selectTimeRange)
  const vessel = useSelector(selectVesselInfoData)

  const [getInsight, { isLoading, data, error }] = useGetVesselInsightMutation({
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
    return (
      <InsightCoverage
        isLoading={isLoading}
        insightData={data as InsightCoverageResponse}
        error={error as InsightErrorResponse}
      />
    )
  }
  if (insight === 'GAP') {
    return (
      <InsightGaps
        isLoading={isLoading}
        insightData={data as InsightGapsResponse}
        error={error as InsightErrorResponse}
      />
    )
  }
  if (insight === 'FISHING') {
    return (
      <InsightFishing
        isLoading={isLoading}
        insightData={data as InsightFishingResponse}
        error={error as InsightErrorResponse}
      />
    )
  }
  if (insight === 'VESSEL-IDENTITY-IUU-VESSEL-LIST') {
    return (
      <InsightIUU
        isLoading={isLoading}
        insightData={data as InsightIUUResponse}
        error={error as InsightErrorResponse}
      />
    )
  }
  if (insight === 'VESSEL-IDENTITY-FLAG-CHANGES') {
    return (
      <InsightFlagChanges
        isLoading={isLoading}
        insightData={data as InsightFlagChangesResponse}
        error={error as InsightErrorResponse}
      />
    )
  }
  if (insight === 'VESSEL-IDENTITY-MOU-LIST') {
    return (
      <InsightMOUList
        isLoading={isLoading}
        insightData={data as InsightMOUListResponse}
        error={error as InsightErrorResponse}
      />
    )
  }
}

export default InsightWrapper
