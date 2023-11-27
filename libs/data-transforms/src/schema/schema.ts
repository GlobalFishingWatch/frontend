import { Dataset, DatasetSchemaItem } from '@globalfishingwatch/api-types'

export const getDatasetSchemaFromGeojson = (geojson: any) => {
  const fields = geojson?.features?.[0]?.properties && Object.keys(geojson.features[0].properties)
  console.log('🚀 ~ getDatasetSchemaFromGeojson ~ fields:', fields)
  return fields.reduce((acc: Dataset['schema'], field: string): Dataset['schema'] => {
    return {
      ...acc,
      [field]: {
        type: typeof geojson.features[0].properties[field],
        // TODO
        // enum:
        //   typeof geojson.features[0].properties[field] === 'string'
        //     ? uniq(geojson.features.map((f: any) => f.properties[field]))
        //     : [],
      } as DatasetSchemaItem,
    }
  }, {})
}

export const getDatasetSchemaFromCSV = ({ data, meta }: DatasetSchemaGeneratorProps) => {
  const fields = meta?.fields
  const schema =
    fields &&
    (fields.reduce((acc: Dataset['schema'], field: string): Dataset['schema'] => {
      const dataWithValue = data.find((d: any) => d[field])
      return dataWithValue
        ? {
            ...acc,
            [field]: {
              type: typeof dataWithValue[field],
              enum:
                typeof dataWithValue[field] === 'string' && field !== 'timestamp'
                  ? uniq(data.map((d) => d[field]))
                  : [],
            } as DatasetSchemaItem,
          }
        : acc
    }, {}) as Dataset['schema'])
  return schema
}
