// TODO:CVP move this to vessels
export type FilterProperty = 'name' | 'flag' | 'mmsi' | 'gear' | 'type'
export const FILTER_PROPERTIES: Record<FilterProperty, string[]> = {
  name: ['shipName'],
  flag: ['flag', 'flagTranslated', 'flagTranslatedClean'],
  mmsi: ['mmsi'],
  gear: ['geartype'],
  type: ['vesselType', 'shiptype'],
}

type ReportFilterProperty = FilterProperty | 'source'
export const REPORT_FILTER_PROPERTIES: Record<ReportFilterProperty, string[]> = {
  ...FILTER_PROPERTIES,
  source: ['source'],
}
