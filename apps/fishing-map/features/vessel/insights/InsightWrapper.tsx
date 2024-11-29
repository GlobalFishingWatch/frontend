import { useSelector } from 'react-redux'
import type { InsightType} from '@globalfishingwatch/api-types';
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { useGetVesselInsightQuery } from 'queries/vessel-insight-api'
import { getVesselIdentities } from 'features/vessel/vessel.utils'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import InsightMOUList from 'features/vessel/insights/InsightMOUList'
import { selectVesselInfoData } from '../selectors/vessel.selectors'
import InsightCoverage from './InsightCoverage'
import InsightFishing from './InsightFishing'
import InsightGaps from './InsightGaps'
import InsightIUU from './InsightIUU'
import InsightFlagChanges from './InsightFlagChanges'

const InsightWrapper = ({ insight }: { insight: InsightType }) => {
  const { start, end } = useSelector(selectTimeRange)
  const vessel = useSelector(selectVesselInfoData)
  const identities = getVesselIdentities(vessel, {
    identitySource: VesselIdentitySourceEnum.SelfReported,
  })

  const { isLoading, data, error } = useGetVesselInsightQuery(
    {
      vessels: identities.map((identity) => ({
        vesselId: identity.id,
        datasetId: vessel.dataset.id,
      })),
      insight,
      start,
      end,
    },
    {
      skip: !identities?.length,
    }
  )

  if (insight === 'COVERAGE') {
    return (
      <InsightCoverage isLoading={isLoading} insightData={data} error={error as ParsedAPIError} />
    )
  }
  if (insight === 'GAP') {
    return <InsightGaps isLoading={isLoading} insightData={data} error={error as ParsedAPIError} />
  }
  if (insight === 'FISHING') {
    return (
      <InsightFishing isLoading={isLoading} insightData={data} error={error as ParsedAPIError} />
    )
  }
  if (insight === 'VESSEL-IDENTITY-IUU-VESSEL-LIST') {
    return <InsightIUU isLoading={isLoading} insightData={data} error={error as ParsedAPIError} />
  }
  if (insight === 'VESSEL-IDENTITY-FLAG-CHANGES') {
    return (
      <InsightFlagChanges
        isLoading={isLoading}
        insightData={data}
        error={error as ParsedAPIError}
      />
    )
  }
  if (insight === 'VESSEL-IDENTITY-MOU-LIST') {
    return (
      <InsightMOUList isLoading={isLoading} insightData={data} error={error as ParsedAPIError} />
    )
  }
}

export default InsightWrapper
