import { DatasetSchema, DatasetSchemaItem } from '@globalfishingwatch/api-types'

const DatasetFieldLabel = ({
  field,
  fieldSchema,
}: {
  field: string
  fieldSchema: DatasetSchema | DatasetSchemaItem
}) => {
  return (
    <span>
      <label style={{ display: 'inline', marginRight: 'var(--space-XS)' }}>
        {fieldSchema.type === 'range' ? '123' : 'ABC'}
      </label>
      {field}
    </span>
  )
}

export default DatasetFieldLabel
