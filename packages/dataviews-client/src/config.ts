import { Generators } from '@globalfishingwatch/layer-composer'

export const RESOURCE_TYPES_BY_VIEW_TYPE: Record<Generators.Type | string, string[]> = {
  [Generators.Type.Track]: ['track', 'info'],
  [Generators.Type.VesselEvents]: ['events'],
}
