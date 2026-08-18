import type { InsightType } from '@globalfishingwatch/api-types'

export const MIN_INSIGHTS_YEAR = 2020

// LONGLINE is not an insights API type, it queries the events API directly
type NonAPIInsights = 'LONGLINE'
export type VesselInsight = InsightType | NonAPIInsights

export const INSIGHTS_NON_FISHING: VesselInsight[] = [
  'COVERAGE',
  'GAP',
  'VESSEL-IDENTITY-IUU-VESSEL-LIST',
  'VESSEL-IDENTITY-FLAG-CHANGES',
  'VESSEL-IDENTITY-MOU-LIST',
]

export const INSIGHTS_FISHING: VesselInsight[] = [...INSIGHTS_NON_FISHING]
INSIGHTS_FISHING.splice(2, 0, 'LONGLINE', 'FISHING')
