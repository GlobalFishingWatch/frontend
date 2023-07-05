import { ColorRampsIds } from '@globalfishingwatch/layer-composer'
export type * from '../../loaders/fourwings/fourwingsTileParser'

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
  // colorRampWhiteEnd?: boolean
  // legend?: GeneratorLegend
  // availableIntervals?: Interval[]
}
