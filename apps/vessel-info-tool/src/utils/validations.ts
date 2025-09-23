import type { ICCATVessel, SPRFMOVessel } from '@/types/vessel.types'

export type MissingFieldsTableType = {
  field: string
  format: string
  emptyRows: number | 'All'
  fallbackValue?: string
}

export function checkMissingMandatoryFields(
  data: (ICCATVessel | SPRFMOVessel)[]
): MissingFieldsTableType[] {
  if (data.length === 0) return []
  const keys = Object.keys(data[0])

  return keys
    .map((field) => {
      let emptyRows = 0

      for (const row of data) {
        const value = row[field as keyof (ICCATVessel | SPRFMOVessel)]
        if (value === undefined || value === null || value === '') {
          emptyRows++
        }
      }

      if (emptyRows > 0) {
        return {
          field: field as string,
          format: typeof data[0][field as keyof (ICCATVessel | SPRFMOVessel)],
          emptyRows: emptyRows === data.length ? 'All' : emptyRows,
          fallbackValue: loadFallbackValue(field as string),
        }
      }

      return undefined
    })
    .filter(Boolean) as MissingFieldsTableType[]
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
