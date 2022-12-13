export const MAX_TIMEBAR_VESSELS = 10
export const TIMEBAR_HEIGHT =
  typeof window !== 'undefined'
    ? parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--timebar-height')
          .replace('rem', '')
      ) * parseFloat(getComputedStyle(document.documentElement).fontSize)
    : 72
