import type { DatasetFilter } from '@globalfishingwatch/api-types'

const DatasetFieldLabel = ({
  field,
  fieldFilter,
}: {
  field: string
  fieldFilter: DatasetFilter
}) => {
  return (
    <span>
      <label style={{ display: 'inline', marginRight: 'var(--space-XS)' }}>
        {fieldFilter.type === 'range' || fieldFilter.type === 'coordinate' ? '123' : 'ABC'}
      </label>
      {field}
    </span>
  )
}

export default DatasetFieldLabel
