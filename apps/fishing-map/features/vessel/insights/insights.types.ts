type InsightBase = {
  period: {
    startDate: string
    endDate: string
  }
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
      valuesInThePeriod: string[]
    }
    iuuBlacklist: {
      totalTimesListed: number
      totalTimesListedInThePeriod: number
      valuesInThePeriod: string[]
    }
    mouList: {
      tokyo: {
        totalTimesListed: number
        totalTimesListedInThePeriod: number
        valuesInThePeriod: string[]
      }
      paris: {
        totalTimesListed: number
        totalTimesListedInThePeriod: number
        valuesInThePeriod: string[]
      }
    }
  }
}

export type InsightResponse =
  | InsightCoverageResponse
  | InsightFishingResponse
  | InsightGapsResponse
  | InsightIdentityResponse
