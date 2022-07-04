export type FlagColor = {
  black: string[]
  grey: string[]
}
export type MOU = {
  tokyo: FlagColor
  paris: FlagColor
}

export type EncounterFishingIndicators = {
  mou: MOU
  eventsInEEZ: string[]
  eventsInMPA: string[]
  eventsInRFMO: string[]
}

export type PortVisitsIndicators = {
  nonPSMAPortState: string[]
}

export type Indicator = {
  id: string
  encounters: EncounterFishingIndicators
  fishing: EncounterFishingIndicators
  portVisits: PortVisitsIndicators
}
