/**
 *
 * @param filters Dataview filters
 * @returns Conditions transformed to apply in the API request and
 *          joined by AND operator
 */
export const transformFilters = (filters: Record<string, any>): string => {
  const queryFiltersFields = [
    {
      value: filters.flag,
      field: 'flag',
      operator: 'IN',
      transformation: (value: any): string =>
        `(${(value as string[])?.map((v: string) => `'${v}'`).join(', ')})`,
    },
    {
      value: filters.fleet,
      field: 'fleet',
      operator: 'IN',
      transformation: (value: any): string =>
        `(${(value as string[])?.map((v: string) => `'${v}'`).join(', ')})`,
    },
    {
      value: filters.origin,
      field: 'origin',
      operator: 'IN',
      transformation: (value: any): string =>
        `(${(value as string[])?.map((v: string) => `'${v}'`).join(', ')})`,
    },
    {
      value: filters.geartype,
      field: 'geartype',
      operator: 'IN',
      transformation: (value: any): string =>
        `(${(value as string[])?.map((v: string) => `'${v}'`).join(', ')})`,
    },
    {
      value: filters.vessel_type,
      field: 'vessel_type',
      operator: 'IN',
      transformation: (value: any): string =>
        `(${(value as string[])?.map((v: string) => `'${v}'`).join(', ')})`,
    },
  ]

  return queryFiltersFields
    .filter(({ value }) => value && value !== undefined)
    .map(
      ({ field, operator, transformation, value }) =>
        `${field} ${operator} ${transformation ? transformation(value) : `'${value}'`}`
    )
    .join(' AND ')
}
