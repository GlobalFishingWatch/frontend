export type DatasetTranslation = {
  name: string
  description: string
  schema: Record<string, any>
}

declare module '@globalfishingwatch/i18n-labels' {
  export const datasets: Record<string, DatasetTranslation>
  export const flags: Record<string, string>
  export const timebar: Record<string, string>
}
