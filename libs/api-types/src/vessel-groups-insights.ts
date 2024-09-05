import {
  InsightBase,
  InsightCoverage,
  InsightFishing,
  InsightGaps,
  InsightIdentity,
} from './vessel-insights'

type VesselGroupInsight<G> = G & { vesselId: string }

export type VesselGroupInsightResponse = InsightBase & {
  vesselIdsWithoutIdentity: string[] | null
  coverage?: VesselGroupInsight<InsightCoverage>[]
  gaps?: VesselGroupInsight<InsightGaps>[]
  apparentFishing?: VesselGroupInsight<InsightFishing>[]
  vesselIdentity?: VesselGroupInsight<InsightIdentity>[]
}
