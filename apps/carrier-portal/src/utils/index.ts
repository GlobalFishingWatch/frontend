import formatDate from 'date-fns/format'
import {
  SEARCH_TYPES,
  SEARCH_SINGLE_SELECTION_FIELD,
  DATE_FORMAT,
  TEXT_DATE_FORMAT,
  ENCOUNTER_RISKS,
  EVENT_DURATION_RANGE,
} from 'data/constants'
import { QueryParams, SearchItem, EventsDurationRange, SearchItemType } from 'types/app.types'
import { AuthorizationOptions, PaginatedVesselSearch, Vessel } from 'types/api/models'

export const trunc = (v: number) => Math.trunc(v * 10000000) / 10000000

export const getUTCDate = (timestamp: string | number = Date.now()) => {
  const date = new Date(timestamp)

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  )
}

export const formatUTCDate = (timestamp: string | number, format: string = TEXT_DATE_FORMAT) => {
  return formatDate(getUTCDate(timestamp), format)
}

interface Field {
  value: string
  type: string
}

interface StaticData {
  rfmo: SearchItem[] | null
  port: SearchItem[] | null
  flag: SearchItem[] | null
  flagDonor: SearchItem[] | null
}

export const getFieldLabel = (
  field: Field,
  staticData: StaticData,
  query?: QueryParams
): string => {
  const { value, type } = field
  let label = ''
  if (type === SEARCH_TYPES.start || type === SEARCH_TYPES.end) {
    label = formatUTCDate(value, DATE_FORMAT)
  } else {
    const data =
      (staticData as any)[type] && (staticData as any)[type].find((d: any) => d.id === value)
    label = data ? data.label : value
  }
  return label
}

export const parseSearchFieldsToQuery = (searchFields: SearchItemType[]) => {
  // Previous async labels needs to be clear from url in case there aren't on the selection anymore
  // const initialReduceValue = SEARCH_ASYNC_FIELDS.reduce(
  //   (acc, field) => ({ ...acc, [`${field}Label`]: undefined }),
  //   {}
  // )
  const query = Object.values(SEARCH_TYPES).reduce<any>((acc, type) => {
    const selection = searchFields.find((field) => field.type === type)
    if (selection === undefined) return { ...acc, [type]: undefined }
    // Adds async labels when selected
    // if (SEARCH_ASYNC_FIELDS.includes(selection.type)) {
    //   acc[`${selection.type}Label`] = selection.label
    // }
    if (SEARCH_SINGLE_SELECTION_FIELD.includes(selection.type)) {
      acc[selection.type] = selection.id
    } else {
      const values = searchFields.filter((field) => field.type === type).map((f) => f.id)
      acc[selection.type] = values
    }
    return acc
  }, {})
  return query
}

export const parseQueryToSearchFields = (query: QueryParams, staticData: StaticData) => {
  return Object.entries(query)
    .filter(
      (entry) =>
        entry[1] !== null &&
        entry[1] !== undefined &&
        Object.values(SEARCH_TYPES).includes(entry[0])
    )
    .reduce<{ id: string; type: string; label: string }[]>((acc, field) => {
      const [type, value] = field
      if (SEARCH_SINGLE_SELECTION_FIELD.includes(type)) {
        const label = getFieldLabel({ value, type }, staticData, query)
        acc.push({ id: value, type, label })
      } else {
        value.forEach((el: string) => {
          const label = getFieldLabel({ value: el, type }, staticData, query)
          acc.push({ id: el, type, label })
        })
      }
      return acc
    }, [])
}

export const filterRfmos = (allRfmos: string[], rfmos: string[]): string[] => {
  if (!allRfmos) return []
  return allRfmos.flatMap<string>((rfmo) => (rfmos.includes(rfmo) ? rfmo : []))
}

export const getRfmoLabel = (rfmo: string): string => {
  if (!rfmo) return ''
  return rfmo
}

export const parseDurationRangeToString = (durationRange: EventsDurationRange) => {
  if (!durationRange) return ''

  const [start, end] = durationRange
  const [durationMin, durationMax] = EVENT_DURATION_RANGE
  let durationRangeParsed = `${start}-${end}`
  if (start === durationMin) {
    durationRangeParsed = `<${end}`
  } else if (end === durationMax) {
    durationRangeParsed = `>${start}`
  }
  return durationRangeParsed
}

export const parseDurationRangeToArray = (duration: string) => {
  if (!duration) return EVENT_DURATION_RANGE

  if (duration.includes('<')) {
    return [EVENT_DURATION_RANGE[0], parseInt(duration.trim().replace('<', ''))]
  } else if (duration.includes('>')) {
    return [parseInt(duration.trim().replace('>', '')), EVENT_DURATION_RANGE[1]]
  }
  const [min = EVENT_DURATION_RANGE[0], max = EVENT_DURATION_RANGE[1]] = duration
    .split('-')
    .map((d) => parseInt(d.trim(), 10))
  return [min, max]
}

export const parseVesselType = (type: string, uppercase = true) => {
  if (!type) return ''
  return type === 'vessel' || type === 'fishing'
    ? `${uppercase ? 'F' : 'f'}ishing vessel`
    : `${uppercase ? 'C' : 'c'}arrier`
}

export const parseVesselSearchResponse = (
  data: PaginatedVesselSearch | null,
  { useSuggestions = true } = {}
) => {
  if (!data) return []

  const vessels =
    data.entries && data.entries.length ? data.entries : useSuggestions ? data.suggestions : []
  return vessels && vessels.length
    ? vessels.map((vessel: Vessel) => {
        const iso = vessel.flags?.length && vessel.flags[0].value
        const mmsi = vessel.mmsi[0]?.value ? `mmsi: ${vessel.mmsi[0].value}` : ''
        const type = vessel.type ? `type: ${vessel.type}` : ''
        const start = vessel.firstTransmissionDate
          ? `start: ${formatUTCDate(vessel.firstTransmissionDate, DATE_FORMAT)}`
          : ''
        const end = vessel.lastTransmissionDate
          ? `end: ${formatUTCDate(vessel.lastTransmissionDate, DATE_FORMAT)}`
          : ''
        return {
          id: vessel.vesselId,
          label: vessel.name,
          legend: [mmsi, type, start, end].filter((l) => !!l).join(', '),
          iso: iso === 'TWN' ? 'TAI' : iso,
        }
      })
    : []
}

export const getEncounterAuthRisk = (authorizationStatus: AuthorizationOptions) => {
  switch (authorizationStatus) {
    case 'authorized':
      return ENCOUNTER_RISKS.authorized
    case 'partially':
      return ENCOUNTER_RISKS.partially
    case 'unmatched':
      return ENCOUNTER_RISKS.unmatched
    default:
      return null
  }
}
