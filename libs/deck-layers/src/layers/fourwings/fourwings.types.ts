import { ColorRampsIds } from '@globalfishingwatch/layer-composer'

export type FourwingsSublayerId = string
export type FourwingsDatasetId = string

export interface FourwingsDeckSublayer {
  id: FourwingsSublayerId
  datasets: FourwingsDatasetId[]
  visible: boolean
  config: {
    color: string
    colorRamp: ColorRampsIds
    visible?: boolean
  }
  // filter?: string
  // vesselGroups?: string
  // legend?: GeneratorLegend
  // availableIntervals?: Interval[]
}
