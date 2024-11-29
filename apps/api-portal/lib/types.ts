import type { ReactNode } from 'react'

export type FieldValidationError<T> = {
  [Field in keyof T]?: string | ReactNode
}
