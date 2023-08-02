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
  transformation?: (field: AdvancedSearchQueryField, operator: string) => string
}

const FIELDS_PARAMS: Record<AdvancedSearchQueryFieldKey, AdvancedSearchQueryFieldParams> = {
  shipname: {
    operator: '=',
    transformation: (field) => `'${(field?.value as string).toLocaleUpperCase()}'`,
  },
  ssvid: {
    operator: '=',
  },
  codMarinha: {
    operator: '=',
  },
  imo: {
    operator: '=',
  },
  callsign: {
    operator: '=',
  },
  owner: {
    operator: '=',
  },
  geartype: {
    operator: '=',
  },
  targetSpecies: {
    operator: '=',
  },
  flag: {
    operator: '=',
  },
  fleet: {
    operator: '=',
  },
  origin: {
    operator: '=',
  },
  lastTransmissionDate: {
    operator: '>=',
  },
  firstTransmissionDate: {
    operator: '<=',
  },
}

export const getAdvancedSearchQuery = (
  fields: AdvancedSearchQueryField[],
  { rootObject }: { rootObject?: 'registryInfo' | 'selfReportedInfo' }
) => {
  const getFieldQuery = (field: AdvancedSearchQueryField) => {
    const params = FIELDS_PARAMS[field.key]
    const value = params?.transformation
      ? params.transformation(field, params.operator)
      : field.value

    if (!value) {
      return ''
    }

    const getFieldValue = (value: string) => {
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
