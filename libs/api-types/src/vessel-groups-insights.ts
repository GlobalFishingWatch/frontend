import type {
  InsightBase,
  InsightCoverage,
  InsightFishing,
  InsightGaps,
  InsightIdentity,
} from './vessel-insights'

export type VesselGroupInsight<G> = G & { vesselId: string; datasets: string[] }

export type VesselGroupInsightResponse = InsightBase & {
  vesselIdsWithoutIdentity: string[] | null
  coverage?: VesselGroupInsight<InsightCoverage>[]
  gap?: VesselGroupInsight<InsightGaps>[]
  apparentFishing?: VesselGroupInsight<InsightFishing>[]
  vesselIdentity?: VesselGroupInsight<InsightIdentity>[]
}
