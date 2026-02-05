import { DateTime } from 'luxon'
import { serverT } from 'server/i18n'

import { DEFAULT_TIME_RANGE } from 'data/config'
import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { formatI18nDate } from 'features/i18n/i18nDate'
import type { AnyWorkspaceState } from 'types'

import type { ConfigurationParams } from './types'

export const DEFAULT_WORKSPACE = `fishing-activity/${DEFAULT_WORKSPACE_ID}`

export function getSharedWorkspaceParams(
  { start_date, end_date, area } = {} as ConfigurationParams
) {
  const params: AnyWorkspaceState = {
    start: start_date || DEFAULT_TIME_RANGE.start,
    end: end_date || DEFAULT_TIME_RANGE.end,
    ...(area?.buffer && {
      reportBufferValue: 50,
      reportBufferUnit: 'nauticalmiles',
      reportBufferOperation: 'dissolve',
    }),
  }
  return params
}

export function getDateRangeLabel(configuration: ConfigurationParams) {
  const { start_date, end_date } = configuration
  if (start_date && end_date) {
    const startDateTime = DateTime.fromISO(start_date)
    const endDateTime = DateTime.fromISO(end_date)
    const duration = endDateTime.diff(startDateTime, ['years', 'months', 'days'])
    if (duration.years === 1 && duration.months === 0 && duration.days === 0) {
      return `in ${startDateTime.toFormat('y')}`
    } else if (duration.years === 0 && duration.months === 1 && duration.days === 0) {
      return `in ${startDateTime.toFormat('LLLL y')}`
    }
    return `between ${formatI18nDate(start_date)} and ${formatI18nDate(end_date)}`
  }
  return ''
}

export function getVesselTypesLabel(vesselTypes: string[]): string {
  if (vesselTypes.length === 1) {
    return serverT(`vessel.vesselTypes.${vesselTypes[0]}`)
  }
  const lastVesselType = vesselTypes.pop()
  return `${vesselTypes.map((v) => serverT(`vessel.vesselTypes.${v}`)).join(',')} and ${serverT(`vessel.vesselTypes.${lastVesselType}`)}`
}

export function getFlagsLabel(flags: string[]): string {
  if (flags.length === 1) {
    return serverT(`flags:${flags[0]}`)
  }
  const lastFlag = flags.pop()
  return `${flags.map((f) => serverT(`flags:${f}`)).join(',')} and ${serverT(`flags:${lastFlag}`)}`
}

export function getFiltersLabel(configuration: ConfigurationParams) {
  let filtersLabel = ''
  let vesselsLabel = ''
  if (configuration.filters?.vessel_types) {
    vesselsLabel = `${getVesselTypesLabel(configuration.filters?.vessel_types).toLowerCase()} vessels`
  } else {
    vesselsLabel = 'vessels'
  }
  if (configuration.filters?.flags) {
    filtersLabel = `by ${vesselsLabel} from ${getFlagsLabel(configuration.filters?.flags)} `
  }
  return filtersLabel
}
