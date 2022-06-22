export const API_GATEWAY_VERSION =
  process.env.API_GATEWAY_VERSION ||
  process.env.REACT_APP_API_GATEWAY_VERSION ||
  process.env.NEXT_PUBLIC_API_GATEWAY_VERSION ||
  'v2'

export const API_GATEWAY =
  process.env.API_GATEWAY ||
  process.env.REACT_APP_API_GATEWAY ||
  process.env.NEXT_PUBLIC_API_GATEWAY ||
  'https://gateway.api.dev.globalfishingwatch.org'

export const DEFAULT_STYLE = {
  version: 8 as const,
  glyphs:
    'https://raw.githubusercontent.com/GlobalFishingWatch/map-gl-glyphs/master/_output/{fontstack}/{range}.pbf?raw=true',
  sprite: 'https://raw.githubusercontent.com/GlobalFishingWatch/map-gl-sprites/master/out/sprites',
  layers: [],
  sources: {},
}
