export type MissingFieldsTableType = {
  field: string
  format: string
  emptyRows: number | 'All'
  fallbackValue?: string
}

export function checkMissingMandatoryFields(
  data: Record<string, any>[],
  mandatoryFields: { field: string; format: string }[]
): MissingFieldsTableType[] {
  return mandatoryFields.map(({ field, format }) => {
    let emptyRows = 0

    for (const row of data) {
      const value = row[field]
      if (value === undefined || value === null || value === '') {
        emptyRows++
      }
    }

    return {
      field,
      format,
      emptyRows: emptyRows === data.length ? 'All' : emptyRows,
      fallbackValue: loadFallbackValue(field),
    }
  })
}

// loading fallback values
const STORAGE_KEY = 'vesselFallbackValues'

type FallbackValues = Record<string, string>

export function saveFallbackValues(values: FallbackValues) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
}

export function loadFallbackValues(): FallbackValues {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : {}
}

export function loadFallbackValue(field: string): string | undefined {
  const values = loadFallbackValues()
  return values[field]
}
