import { useSelector } from 'react-redux'
import { useGetVesselInsightQuery } from 'queries/vessel-insight-api'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import type { InsightType } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectHasDeprecatedDataviewInstances } from 'features/dataviews/selectors/dataviews.instances.selectors'
import InsightMOUList from 'features/vessel/insights/InsightMOUList'
import { getVesselIdentities } from 'features/vessel/vessel.utils'

import { selectVesselInfoData } from '../selectors/vessel.selectors'

import InsightCoverage from './InsightCoverage'
import InsightFishing from './InsightFishing'
import InsightFlagChanges from './InsightFlagChanges'
import InsightGaps from './InsightGaps'
import InsightIUU from './InsightIUU'

const InsightWrapper = ({ insight }: { insight: InsightType }) => {
  const { start, end } = useSelector(selectTimeRange)
  const vessel = useSelector(selectVesselInfoData)
  const hasDeprecatedDataviewInstances = useSelector(selectHasDeprecatedDataviewInstances)
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
      skip: !identities?.length || hasDeprecatedDataviewInstances,
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
