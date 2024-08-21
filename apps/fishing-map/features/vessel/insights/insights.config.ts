import { InsightType } from '@globalfishingwatch/api-types'

export const MIN_INSIGHTS_YEAR = 2020

export const INSIGHTS_NON_FISHING: InsightType[] = [
  'COVERAGE',
  'GAP',
  'VESSEL-IDENTITY-IUU-VESSEL-LIST',
  'VESSEL-IDENTITY-FLAG-CHANGES',
  'VESSEL-IDENTITY-MOU-LIST',
]

export const INSIGHTS_FISHING: InsightType[] = [...INSIGHTS_NON_FISHING]
INSIGHTS_FISHING.splice(2, 0, 'FISHING')
