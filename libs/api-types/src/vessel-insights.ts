type InsightBase = {
  period: {
    startDate: string
    endDate: string
  }
}

type ValueInPeriod = {
  from: string
  to: string
  value: string
}

export type InsightCoverageResponse = InsightBase & {
  coverage: {
    blocks: number
    blocksWithPositions: number
    percentage: number
    historicalCoverage: {
      blocks: number
      blocksWithPositions: number
      percentage: number
    }
  }
}

export type InsightFishingResponse = InsightBase & {
  apparentFishing: {
    datasets: string[]
    historicalCounters: {
      events: number
      eventsInRFMOWithoutKnownAuthorization: number
      eventsInNoTakeMPAs: number
    }
    periodSelectedCounters: {
      events: number
      eventsInRFMOWithoutKnownAuthorization: number
      eventsInNoTakeMPAs: number
    }
    eventsInRfmoWithoutKnownAuthorization: string[]
    eventsInNoTakeMpas: string[]
  }
}

export type InsightGapsResponse = InsightBase & {
  gap: {
    datasets: string[]
    historicalCounters: {
      events: number
      eventsGapOff: number
    }
    periodSelectedCounters: {
      events: number
      eventsGapOff: number
    }
    aisOff: string[]
  }
}

export type InsightIdentityResponse = InsightBase & {
  vesselIdentity: {
    datasets: string[]
    flagsChanges: {
      totalTimesListed: number
      totalTimesListedInThePeriod: number
      valuesInThePeriod: ValueInPeriod[]
    }
    iuuBlacklist: {
      totalTimesListed: number
      totalTimesListedInThePeriod: number
      valuesInThePeriod: ValueInPeriod[]
    }
    mouList: {
      tokyo: {
        totalTimesListed: number
        totalTimesListedInThePeriod: number
        valuesInThePeriod: ValueInPeriod[]
      }
      paris: {
        totalTimesListed: number
        totalTimesListedInThePeriod: number
        valuesInThePeriod: ValueInPeriod[]
      }
    }
  }
}

export type InsightResponse =
  | InsightCoverageResponse
  | InsightFishingResponse
  | InsightGapsResponse
  | InsightIdentityResponse
