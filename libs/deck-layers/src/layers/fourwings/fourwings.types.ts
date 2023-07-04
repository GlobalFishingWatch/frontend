import { ColorRampsIds } from '@globalfishingwatch/layer-composer'

export type FourwingsSublayerId = string
export type FourwingsDatasetId = string

export interface FourwingsSublayer {
  id: FourwingsSublayerId
  datasets: FourwingsDatasetId[]
  config: {
    color: string
    colorRamp: ColorRampsIds
    visible?: boolean
  }
  // filter?: string
  // vesselGroups?: string
  // colorRampWhiteEnd?: boolean
  // legend?: GeneratorLegend
  // availableIntervals?: Interval[]
}
