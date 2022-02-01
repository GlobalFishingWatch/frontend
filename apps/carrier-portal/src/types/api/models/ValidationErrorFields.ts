import { ValidationErrorErrors } from './'

/**
 *
 * @export
 * @interface ValidationErrorFields
 */
export interface ValidationErrorFields {
  /**
   *
   * @type {string}
   * @memberof ValidationErrorFields
   */
  field: string
  /**
   *
   * @type {Array<ValidationErrorErrors>}
   * @memberof ValidationErrorFields
   */
  errors: ValidationErrorErrors[]
}
