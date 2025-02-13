export type FilterProperty = 'name' | 'flag' | 'mmsi' | 'type'
export const FILTER_PROPERTIES: Record<FilterProperty, string[]> = {
  name: ['shipName'],
  flag: ['flag', 'flagTranslated', 'flagTranslatedClean'],
  mmsi: ['mmsi'],
  type: ['geartype', 'vesselType', 'shiptype'],
}

type ReportFilterProperty = FilterProperty | 'source'
export const REPORT_FILTER_PROPERTIES: Record<ReportFilterProperty, string[]> = {
  ...FILTER_PROPERTIES,
  source: ['source'],
}
