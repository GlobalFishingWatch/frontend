export type FieldValidationError<T> = {
  [Field in keyof T]?: string
}
