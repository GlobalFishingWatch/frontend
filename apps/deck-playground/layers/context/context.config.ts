export const CONTEXT_LAYERS_CONFIG = [
  {
    id: 'grid',
    apiPath:
      'https://gateway.api.dev.globalfishingwatch.org/v2/datasets/public-graticules/user-context-layer-v1/{z}/{x}/{y}',
    lineColor: [192, 192, 192],
  },
  {
    id: 'eez',
    apiPath:
      'https://gateway.api.dev.globalfishingwatch.org/v2/datasets/public-eez-areas/user-context-layer-v1/{z}/{x}/{y}',
    lineColor: [0, 192, 192],
  },
  {
    id: 'mpas',
    apiPath:
      'https://gateway.api.dev.globalfishingwatch.org/v2/datasets/public-mpa-all/user-context-layer-v1/{z}/{x}/{y}',
    lineColor: [192, 0, 192],
  },
  {
    id: 'fao',
    apiPath:
      'https://gateway.api.dev.globalfishingwatch.org/v2/datasets/public-fao-major/user-context-layer-v1/{z}/{x}/{y}',
    lineColor: [192, 192, 0],
  },
  {
    id: 'rfmo',
    apiPath:
      'https://gateway.api.dev.globalfishingwatch.org/v2/datasets/public-rfmo/user-context-layer-v1/{z}/{x}/{y}',
    lineColor: [254, 254, 254],
  },
  {
    id: 'high-seas',
    apiPath:
      'https://gateway.api.dev.globalfishingwatch.org/v2/datasets/public-high-seas/user-context-layer-v1/{z}/{x}/{y}',
    lineColor: [254, 254, 0],
  },
]
