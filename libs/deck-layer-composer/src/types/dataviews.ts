import type {
  Dataset,
  DataviewConfig,
  DataviewContexLayerConfig,
  DataviewInstance,
} from '@globalfishingwatch/api-types'
import { type ContextSubLayerConfig } from '@globalfishingwatch/deck-layers'

export type FourwingsSublayerConfig = {
  id: string
  datasets: Dataset[]
  visible?: boolean
  color?: string
  colorRamp?: string
  filter?: DataviewConfig['filter']
  filters?: DataviewConfig['filters']
  filterIds?: DataviewConfig['filterIds']
  vesselGroups?: DataviewConfig['vessel-groups']
  /** Needed to update the layer when the vessel group is edited */
  vesselGroupsLength?: number
  maxZoom?: number
}

export type ResolvedFourwingsDataviewInstance = Omit<DataviewInstance, 'dataviewId' | 'config'> & {
  config: DataviewConfig & {
    /** Fourwings layers merged, needed for Activity or Detections */
    sublayers?: FourwingsSublayerConfig[]
  }
}

export type ResolvedContextDataviewInstance = Omit<DataviewInstance, 'dataviewId' | 'config'> & {
  config: Omit<DataviewConfig, 'layers'> & {
    layers: (DataviewContexLayerConfig & {
      sublayers: ContextSubLayerConfig[]
    })[]
  }
}

export type ResolvedDataviewInstance =
  | DataviewInstance
  | ResolvedFourwingsDataviewInstance
  | ResolvedContextDataviewInstance
