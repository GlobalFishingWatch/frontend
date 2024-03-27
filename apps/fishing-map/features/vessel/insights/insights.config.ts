import { InsightType } from '@globalfishingwatch/api-types'

export const MIN_INSIGHTS_YEAR = 2017

export const INSIGHTS_NON_FISHING: InsightType[] = [
  'COVERAGE',
  'GAP',
  'VESSEL-IDENTITY-FLAG-CHANGES',
  'VESSEL-IDENTITY-MOU-LIST',
]

export const INSIGHTS_FISHING: InsightType[] = [
  'COVERAGE',
  'GAP',
  'FISHING',
  'VESSEL-IDENTITY-IUU-VESSEL-LIST',
  'VESSEL-IDENTITY-FLAG-CHANGES',
  'VESSEL-IDENTITY-MOU-LIST',
]
