export const COLOR_PRIMARY_BLUE =
  (typeof window !== 'undefined' &&
    getComputedStyle(document.documentElement).getPropertyValue('--color-primary-blue')) ||
  'rgb(22, 63, 137)'
export const COLOR_SECONDARY_BLUE =
  (typeof window !== 'undefined' &&
    getComputedStyle(document.documentElement).getPropertyValue('--color-secondary-blue')) ||
  'rgb(22, 63, 137, .75)'
export const COLOR_GRADIENT =
  (typeof window !== 'undefined' &&
    getComputedStyle(document.documentElement).getPropertyValue('--color-gradient')) ||
  'rgb(229, 240, 242)'
