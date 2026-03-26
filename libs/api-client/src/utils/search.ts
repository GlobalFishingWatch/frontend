import type { JSX } from 'react'
import partition from 'lodash/partition'

// Copied from ui-components to avoid circular dependencies
export type MultiSelectOption<ID = any, Label = string | JSX.Element> = {
  id: ID
  label: Label
  alias?: string[]
  tooltip?: string
}

export const ADVANCED_SEARCH_QUERY_FIELDS = [
  'id' as const,
  'shipname' as const,
  'ssvid' as const,
  'imo' as const,
  'mmsi' as const,
  'callsign' as const,
  'flag' as const,
  'fleet' as const,
  'geartypes' as const,
  'shiptypes' as const,
  'transmissionDateFrom' as const,
  'transmissionDateTo' as const,
  'owner' as const,
  // VMS pipe 3
  'origin' as const,
  'fleet' as const,
  'externalId' as const,
  'nationalId' as const,
  'codMarinha' as const,
  'targetSpecies' as const,
  'selfReportedInfo.codMarinha' as const,
  'selfReportedInfo.nationalId' as const,
  // VMS pipe 4
  'selfReportedInfo.externalId' as const,
  'selfReportedInfo.sourceFleet' as const,
  // VMS-PER
  'selfReportedInfo.hull' as const,
  'selfReportedInfo.origin' as const,
  // VMS-BRA
  'selfReportedInfo.fishingLicenseCode' as const,
  'selfReportedInfo.fleetCode' as const,
  'selfReportedInfo.vesselRegistrationCode' as const,
] as const
export type AdvancedSearchQueryFieldKey = (typeof ADVANCED_SEARCH_QUERY_FIELDS)[number]

export type AdvancedSearchQueryField = {
  key: AdvancedSearchQueryFieldKey
  value: string | string[] | undefined
  operator?: AdvancedSearchOperator
  combinedWithOR?: boolean
}

type AdvancedSearchOperator = '=' | '>' | '<' | 'LIKE'
type AdvancedSearchQueryFieldParams = {
  operator: AdvancedSearchOperator
  transformation?: (field: AdvancedSearchQueryField) => string | string[]
}

const withQuotationMarks = (field: AdvancedSearchQueryField) => {
  if (!field.value) return ''
  const transform = (value: string) => `'${value}'`
  return Array.isArray(field.value) ? field.value.map(transform) : transform(field.value)
}

const toUpperCaseWithQuotationMarks = (field: AdvancedSearchQueryField) => {
  if (!field.value) return ''
  const transform = (value: string) => `'${value}'`.toUpperCase()
  return Array.isArray(field.value) ? field.value.map(transform) : transform(field.value)
}

const toUpperCaseWithWildcardsAndQuotationMarks = (field: AdvancedSearchQueryField) => {
  if (!field.value) return ''
  const transform = (value: string) => `'*${value}*'`.toUpperCase()
  return Array.isArray(field.value) ? field.value.map(transform) : transform(field.value)
}

const FIELDS_PARAMS: Record<AdvancedSearchQueryFieldKey, AdvancedSearchQueryFieldParams> = {
  shipname: {
    operator: 'LIKE',
    transformation: toUpperCaseWithWildcardsAndQuotationMarks,
  },
  ssvid: {
    operator: '=',
    transformation: toUpperCaseWithQuotationMarks,
  },
  mmsi: {
    operator: '=',
    transformation: toUpperCaseWithQuotationMarks,
  },
  imo: {
    operator: '=',
    transformation: toUpperCaseWithQuotationMarks,
  },
  callsign: {
    operator: '=',
    transformation: toUpperCaseWithQuotationMarks,
  },
  owner: {
    operator: 'LIKE',
    transformation: toUpperCaseWithWildcardsAndQuotationMarks,
  },
  id: {
    operator: '=',
  },
  geartypes: {
    operator: '=',
  },
  shiptypes: {
    operator: '=',
  },
  flag: {
    operator: '=',
    transformation: withQuotationMarks,
  },
  transmissionDateFrom: {
    operator: '<',
    transformation: toUpperCaseWithQuotationMarks,
  },
  transmissionDateTo: {
    operator: '>',
    transformation: toUpperCaseWithQuotationMarks,
  },
  // VMS pipe 3
  externalId: {
    operator: '=',
  },
  nationalId: {
    operator: 'LIKE',
    transformation: toUpperCaseWithWildcardsAndQuotationMarks,
  },
  codMarinha: {
    operator: '=',
  },
  'selfReportedInfo.externalId': {
    operator: '=',
  },
  'selfReportedInfo.codMarinha': {
    operator: '=',
  },
  'selfReportedInfo.nationalId': {
    operator: 'LIKE',
    transformation: toUpperCaseWithWildcardsAndQuotationMarks,
  },
  targetSpecies: {
    operator: '=',
  },
  fleet: {
    operator: '=',
  },
  origin: {
    operator: '=',
  },
  // VMS pipe 4
  'selfReportedInfo.sourceFleet': {
    operator: '=',
  },
  // VMS-PER
  'selfReportedInfo.hull': {
    operator: '=',
  },
  'selfReportedInfo.origin': {
    operator: '=',
  },
  // VMS-BRA
  'selfReportedInfo.fishingLicenseCode': {
    operator: '=',
    transformation: withQuotationMarks,
  },
  'selfReportedInfo.fleetCode': {
    operator: '=',
    transformation: withQuotationMarks,
  },
  'selfReportedInfo.vesselRegistrationCode': {
    operator: '=',
    transformation: withQuotationMarks,
  },
}

export const getAdvancedSearchQuery = (
  fields: AdvancedSearchQueryField[],
  { rootObject } = {} as { rootObject?: 'registryInfo' | 'selfReportedInfo' }
) => {
  const getFieldQuery = (field: AdvancedSearchQueryField) => {
    const params = FIELDS_PARAMS[field.key]
    const value = params?.transformation ? params.transformation(field) : field.value

    if (!value) {
      return ''
    }

    const getFieldValue = (value: string) => {
      const operator = field?.operator || params?.operator || '='
      if (field.key === 'id') {
        return `selfReportedInfo.id ${operator} '${value}'`
      }
      if (field.key === 'owner') {
        return `registryOwners.name ${operator} ${value}`
      }
      if (field.key === 'shiptypes') {
        return `combinedSourcesInfo.shiptypes.name ${operator} ${value}`
      }
      if (rootObject === 'selfReportedInfo' && field.key === 'geartypes') {
        return `combinedSourcesInfo.geartypes.name ${operator} ${value}`
      }
      const rootObjectPrefix = `${rootObject}.`
      const query = `${field.key} ${operator} ${value}`
      if (!rootObject || field.key.includes(rootObjectPrefix)) {
        return query
      }
      return `${rootObjectPrefix}${query}`
    }
    if (Array.isArray(value)) {
      const filter = value
        .map((v) => getFieldValue(params.transformation ? v : `'${v}'`))
        .join(' OR ')
      return `(${filter})`
    }
    return getFieldValue(value)
  }

  const [fieldsQueriesCombinedWithOR, fieldsQueriesCombinedWithAND] = partition(
    fields.filter((field) => field.value !== undefined && field.value !== '' && field.value.length),
    (field) => field.combinedWithOR
  ).map((fields) => fields.map(getFieldQuery))

  const query = [
    ...(fieldsQueriesCombinedWithOR.length
      ? [`(${fieldsQueriesCombinedWithOR.join(' OR ')})`]
      : []),
    ...fieldsQueriesCombinedWithAND,
  ].join(' AND ')
  return query
}
