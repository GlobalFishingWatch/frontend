import { partition } from 'lodash'

export type MultiSelectOption<T = any> = {
  id: T
  label: string
  alias?: string[]
  tooltip?: string
}

export type AdvancedSearchQueryFieldKey =
  | 'shipname'
  | 'ssvid'
  | 'imo'
  | 'callsign'
  | 'codMarinha'
  | 'flag'
  | 'geartype'
  | 'targetSpecies'
  | 'fleet'
  | 'origin'
  // TODO remove camelCase once api are stable
  | 'lastTransmissionDate'
  | 'firstTransmissionDate'
  | 'owner'

export type AdvancedSearchQueryField = {
  key: AdvancedSearchQueryFieldKey
  value: string | string[] | undefined
  combinedWithOR?: boolean
}

type AdvancedSearchQueryFieldParams = {
  operator: string
  transformation?: (field: AdvancedSearchQueryField) => string
}

const toUpperCaseWithQuotationMarks = (field: AdvancedSearchQueryField) =>
  `'${(field?.value as string).toUpperCase()}'`

const FIELDS_PARAMS: Record<AdvancedSearchQueryFieldKey, AdvancedSearchQueryFieldParams> = {
  shipname: {
    operator: '=',
    transformation: toUpperCaseWithQuotationMarks,
  },
  ssvid: {
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
    operator: '=',
    transformation: toUpperCaseWithQuotationMarks,
  },
  geartype: {
    operator: '=',
  },
  flag: {
    operator: '=',
  },
  lastTransmissionDate: {
    operator: '>=',
  },
  firstTransmissionDate: {
    operator: '<=',
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
  { rootObject }: { rootObject?: 'registryInfo' | 'selfReportedInfo' }
) => {
  const getFieldQuery = (field: AdvancedSearchQueryField) => {
    const params = FIELDS_PARAMS[field.key]
    const value = params?.transformation ? params.transformation(field) : field.value

    if (!value) {
      return ''
    }

    const getFieldValue = (value: string) => {
      if (field.key === 'owner') {
        return `registryOwners.name ${params?.operator} ${value}`
      }
      return rootObject
        ? `${rootObject}.${field.key} ${params?.operator} ${value}`
        : `${field.key} ${params?.operator} ${value}`
    }
    if (Array.isArray(value)) {
      const filter = value.map((v) => getFieldValue(`'${v}'`)).join(' OR ')
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
