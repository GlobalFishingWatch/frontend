export type FourwingsHeatmapInteraction = {
  id: string
}

export type FourwingsEventsInteraction = {
  events: number
  id: string
}

export type FourwingsInteraction = FourwingsHeatmapInteraction | FourwingsEventsInteraction
