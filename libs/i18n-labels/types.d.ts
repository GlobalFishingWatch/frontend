type JsonObject = Record<string, string>

declare module '*.json' {
  const value: JsonObject
  export default value
}

declare module '@globalfishingwatch/i18n-labels' {
  export const datasets: JsonObject
  export const flags: JsonObject
  export const timebar: JsonObject
}
