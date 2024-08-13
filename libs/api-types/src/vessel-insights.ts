export type InsightType =
  | 'COVERAGE'
  | 'GAP'
  | 'FISHING'
  | 'VESSEL-IDENTITY-IUU-VESSEL-LIST'
  | 'VESSEL-IDENTITY-FLAG-CHANGES'
  | 'VESSEL-IDENTITY-MOU-LIST'

type InsightBase = {
  period: {
    startDate: string
    endDate: string
  }
}

export type ValueInPeriod = {
  from: string
  to: string
  value: string // BLACK | GREY
  reference: string // Flag
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

export type InsightFlagChangesResponse = InsightBase & {
  vesselIdentity: {
    datasets: string[]
    flagsChanges: {
      totalTimesListed: number
      totalTimesListedInThePeriod: number
      valuesInThePeriod: ValueInPeriod[]
    }
  }
}

export type InsightMOUListResponse = InsightBase & {
  vesselIdentity: {
    datasets: string[]
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

export type InsightIUUResponse = InsightBase & {
  vesselIdentity: {
    datasets: string[]
    iuuVesselList: {
      totalTimesListed: number
      totalTimesListedInThePeriod: number
      valuesInThePeriod: ValueInPeriod[]
    }
  }
}

export type InsightResponse =
  | InsightCoverageResponse
  | InsightFishingResponse
  | InsightGapsResponse
  | InsightFlagChangesResponse
  | InsightMOUListResponse
  | InsightIUUResponse
