import type timebarJson from './source/timebar.json'

declare module '@globalfishingwatch/i18n-labels' {
  export const flags: Record<string, string>
  export const timebar: typeof timebarJson
}
