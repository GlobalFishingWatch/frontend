import { partition } from 'lodash'
import { MultiSelectOption } from '@globalfishingwatch/ui-components'

export type AdvancedSearchQueryFieldKey =
  | 'shipname'
  | 'mmsi'
  | 'imo'
  | 'callsign'
  | 'flag'
  | 'fleet'
  | 'origin'
  | 'lastTransmissionDate'
  | 'firstTransmissionDate'

export type AdvancedSearchQueryField = {
  key: AdvancedSearchQueryFieldKey
  value: string | MultiSelectOption<string>[] | undefined
  combinedWithOR?: boolean
}

type AdvancedSearchQueryFieldParams = {
  operator: string
  transformation?: (value: string | MultiSelectOption<string>[]) => string
}

const multiSelectOptionToQuery = (value: string | MultiSelectOption<string>[]): string =>
  `(${(value as MultiSelectOption<string>[])?.map((f) => `'${f.id}'`).join(', ')})`

const FIELDS_PARAMS: Record<AdvancedSearchQueryFieldKey, AdvancedSearchQueryFieldParams> = {
  shipname: {
    operator: 'LIKE',
    transformation: (value) => `'%${(value as string).toUpperCase()}%'`,
  },
  mmsi: {
    operator: '=',
  },
  imo: {
    operator: '=',
  },
  callsign: {
    operator: '=',
  },
  flag: {
    operator: 'IN',
    transformation: multiSelectOptionToQuery,
  },
  fleet: {
    operator: 'IN',
    transformation: multiSelectOptionToQuery,
  },
  origin: {
    operator: 'IN',
    transformation: multiSelectOptionToQuery,
  },
  lastTransmissionDate: {
    operator: '>=',
  },
  firstTransmissionDate: {
    operator: '<=',
  },
}

export const getAdvancedSearchQuery = (fields: AdvancedSearchQueryField[]) => {
  const getFieldQuery = (field: AdvancedSearchQueryField) => {
    const params = FIELDS_PARAMS[field.key]
    const value = params.transformation
      ? params.transformation(field.value as string | MultiSelectOption[])
      : `'${field.value}'`
    const query = `${field.key} ${params.operator} ${value}`
    return query
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
