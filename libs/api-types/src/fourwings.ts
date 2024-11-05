export type FourwingsHeatmapInteraction = {
  id: string
}

export type FourwingsEventsInteraction = {
  events: number
  id: string
  portId?: string
}

export type FourwingsInteraction = FourwingsHeatmapInteraction | FourwingsEventsInteraction
