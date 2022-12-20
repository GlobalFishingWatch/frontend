import { ColorRampsIds } from '@globalfishingwatch/layer-composer'

export type FourwingsDatasetId = string

export interface FourwingsSublayer {
  id: string
  datasets: FourwingsDatasetId[]
  colorRamp: ColorRampsIds
  // visible?: boolean
  // filter?: string
  // vesselGroups?: string
  // colorRampWhiteEnd?: boolean
  // legend?: GeneratorLegend
  // availableIntervals?: Interval[]
}
