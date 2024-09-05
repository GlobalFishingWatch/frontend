import { useSelector } from 'react-redux'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'
import { InsightType } from '@globalfishingwatch/api-types'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'

const VesselGroupReportInsightWrapper = ({
  insight,
  vesselGroupId,
}: {
  insight: InsightType
  vesselGroupId: string
}) => {
  const { start, end } = useSelector(selectTimeRange)
  const { data, isLoading } = useGetVesselGroupInsightQuery(
    {
      'vessel-groups': [vesselGroupId],
      includes: [insight],
      'start-date': start,
      'end-date': end,
    }
    // { skip: false }
  )

  return null

  // if (insight === 'COVERAGE') {
  //   return (
  //     <InsightCoverage
  //       isLoading={isLoading}
  //       insightData={data as InsightCoverageResponse}
  //       error={error as ParsedAPIError}
  //     />
  //   )
  // }
  // if (insight === 'GAP') {
  //   return (
  //     <InsightGaps
  //       isLoading={isLoading}
  //       insightData={data as InsightGapsResponse}
  //       error={error as ParsedAPIError}
  //     />
  //   )
  // }
  // if (insight === 'FISHING') {
  //   return (
  //     <InsightFishing
  //       isLoading={isLoading}
  //       insightData={data as InsightFishingResponse}
  //       error={error as ParsedAPIError}
  //     />
  //   )
  // }
  // if (insight === 'VESSEL-IDENTITY-IUU-VESSEL-LIST') {
  //   return (
  //     <InsightIUU
  //       isLoading={isLoading}
  //       insightData={data as InsightIUUResponse}
  //       error={error as ParsedAPIError}
  //     />
  //   )
  // }
  // if (insight === 'VESSEL-IDENTITY-FLAG-CHANGES') {
  //   return (
  //     <InsightFlagChanges
  //       isLoading={isLoading}
  //       insightData={data as InsightFlagChangesResponse}
  //       error={error as ParsedAPIError}
  //     />
  //   )
  // }
  // if (insight === 'VESSEL-IDENTITY-MOU-LIST') {
  //   return (
  //     <InsightMOUList
  //       isLoading={isLoading}
  //       insightData={data as InsightMOUListResponse}
  //       error={error as ParsedAPIError}
  //     />
  //   )
  // }
}

export default VesselGroupReportInsightWrapper
