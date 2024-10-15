export type InsightType =
  | 'COVERAGE'
  | 'GAP'
  | 'FISHING'
  | 'VESSEL-IDENTITY-IUU-VESSEL-LIST'
  | 'VESSEL-IDENTITY-FLAG-CHANGES'
  | 'VESSEL-IDENTITY-MOU-LIST'

export type InsightBase = {
  period: {
    startDate: string
    endDate: string
  }
}

export type InsightValueInPeriod = {
  from: string
  to: string
  value: string // BLACK | GREY
  reference: string // Flag
}

export type InsightCoverage = {
  blocks: number
  blocksWithPositions: number
  percentage: number
}

export type InsightFishing = {
  datasets: string[]
  periodSelectedCounters: {
    events: number
    eventsInRFMOWithoutKnownAuthorization: number
    eventsInNoTakeMPAs: number
  }
  eventsInRfmoWithoutKnownAuthorization: string[]
  eventsInNoTakeMpas: string[]
}

export type InsightGaps = {
  datasets: string[]
  periodSelectedCounters: {
    events: number
    eventsGapOff: number
  }
  aisOff: string[]
}

export type InsightIdentityEntry = {
  totalTimesListed: number
  totalTimesListedInThePeriod: number
  valuesInThePeriod: InsightValueInPeriod[]
}

export type InsightIdentityMOU = {
  mouList?: {
    tokyo: InsightIdentityEntry
    paris: InsightIdentityEntry
  }
}

export type InsightIdentityIUU = {
  iuuVesselList?: InsightIdentityEntry
}

export type InsightIdentityFlagsChanges = {
  flagsChanges?: InsightIdentityEntry
}

export type InsightIdentity<
  InsighIdentityType = InsightIdentityMOU & InsightIdentityIUU & InsightIdentityFlagsChanges
> = {
  datasets: string[]
} & InsighIdentityType

export type InsightResponse = InsightBase & {
  coverage?: InsightCoverage
  gap?: InsightGaps
  apparentFishing?: InsightFishing
  vesselIdentity?: InsightIdentity
}
