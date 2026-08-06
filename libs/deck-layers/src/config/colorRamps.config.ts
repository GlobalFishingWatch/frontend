export const COLOR_RAMP_DEFAULT_NUM_STEPS = 10
export const COLOR_RAMP_BIVARIATE_NUM_STEPS = 4
export const COLOR_RAMP_DEFAULT_NUM_STEPS_TO_WHITE = [7, 3]

// ---- Heatmap Generator color ramps types
export type ColorRampId =
  | 'teal'
  | 'magenta'
  | 'lilac'
  | 'salmon'
  | 'sky'
  | 'red'
  | 'yellow'
  | 'green'
  | 'orange'
  | 'bathymetry' // Custom one for the bathymetry dataset

export type ColorRampWhiteId =
  | 'teal_toWhite'
  | 'magenta_toWhite'
  | 'lilac_toWhite'
  | 'salmon_toWhite'
  | 'sky_toWhite'
  | 'red_toWhite'
  | 'yellow_toWhite'
  | 'green_toWhite'
  | 'orange_toWhite'
  | 'bathymetry_toWhite'

export type ColorRampsIds = ColorRampId | ColorRampWhiteId

export const SPECTRAL_COLOR_RAMP_ID = 'spectral'
export const SPECTRAL_REVERSED_COLOR_RAMP_ID = 'spectral_reversed'

// RdYlBu (Opaque and multi hue, it only reads correctly when a single heatmap layer is visible.
export const SPECTRAL_COLOR_RAMP = [
  '#313695',
  '#4575b4',
  '#74add1',
  '#abd9e9',
  '#e0f3f8',
  '#fee090',
  '#fdae61',
  '#f46d43',
  '#d73027',
  '#a50026',
]

export const SPECTRAL_REVERSED_COLOR_RAMP = [...SPECTRAL_COLOR_RAMP].reverse()

export const MULTI_HUE_COLOR_RAMPS = {
  [SPECTRAL_COLOR_RAMP_ID]: SPECTRAL_COLOR_RAMP,
  [SPECTRAL_REVERSED_COLOR_RAMP_ID]: SPECTRAL_REVERSED_COLOR_RAMP,
}

export type MultiHueColorRampId = keyof typeof MULTI_HUE_COLOR_RAMPS
export type AnyColorRampId = ColorRampId | MultiHueColorRampId

export const HEATMAP_COLORS_BY_ID: Record<ColorRampId, string> = {
  teal: '#00FFBC',
  magenta: '#FF64CE',
  lilac: '#9CA4FF',
  salmon: '#FFAE9B',
  sky: '#00EEFF',
  red: '#FF6854',
  yellow: '#FFEA00',
  green: '#A6FF59',
  orange: '#FFAA0D',
  bathymetry: '#4069a6',
}

export const DEFAULT_COLOR_RAMP_ID: ColorRampId = 'teal'

export const TIME_COMPARE_COLOR_RAMP = [
  '#00D7E6',
  '#02AFCC',
  '#0392B9',
  '#0474A6',
  '#055994',
  '#5F2B64',
  '#84396A',
  '#B14972',
  '#D75879',
  '#FF6680',
]

export const BLEND_BACKGROUND = '#0f2e5f'
