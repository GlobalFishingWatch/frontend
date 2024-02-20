import { partition } from 'lodash'
import type { JSX } from 'react'

// Copied from ui-components to avoid circular dependencies
export type MultiSelectOption<ID = any, Label = string | JSX.Element> = {
  id: ID
  label: Label
  alias?: string[]
  tooltip?: string
}

export type AdvancedSearchQueryFieldKey =
  | 'shipname'
  | 'ssvid'
  | 'imo'
  | 'mmsi'
  | 'callsign'
  | 'codMarinha'
  | 'flag'
  | 'geartypes'
  | 'shiptypes'
  | 'targetSpecies'
  | 'fleet'
  | 'origin'
  | 'transmissionDateFrom'
  | 'transmissionDateTo'
  | 'owner'

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

const toUpperCaseWithQuotationMarks = (field: AdvancedSearchQueryField) => {
  if (!field.value) return ''
  const transform = (value: string) => `'${value}'`.toUpperCase()
  return Array.isArray(field.value) ? field.value.map(transform) : transform(field.value)
}

const toUpperCaseWithWildcardsAndQuotationMarks = (field: AdvancedSearchQueryField) => {
  if (!field.value) return ''
  const transform = (value: string) => `'%${value}%'`.toUpperCase()
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
  geartypes: {
    operator: '=',
  },
  shiptypes: {
    operator: '=',
  },
  flag: {
    operator: '=',
  },
  transmissionDateFrom: {
    operator: '<',
    transformation: toUpperCaseWithQuotationMarks,
  },
  transmissionDateTo: {
    operator: '>',
    transformation: toUpperCaseWithQuotationMarks,
  },
  // VMS specific
  codMarinha: {
    operator: '=',
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
      const operator = field.operator || params.operator || '='
      if (field.key === 'owner') {
        return `registryOwners.name ${operator} ${value}`
      }
      if (field.key === 'shiptypes') {
        return `combinedSourcesInfo.shiptypes.name ${operator} ${value}`
      }
      if (rootObject === 'selfReportedInfo' && field.key === 'geartypes') {
        return `combinedSourcesInfo.geartypes.name ${operator} ${value}`
      }
      return rootObject
        ? `${rootObject}.${field.key} ${operator} ${value}`
        : `${field.key} ${operator} ${value}`
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
