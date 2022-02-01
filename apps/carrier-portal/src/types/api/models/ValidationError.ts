import { ValidationErrorErrors, ValidationErrorFields } from './'

/**
 *
 * @export
 * @interface ValidationError
 */
export interface ValidationError {
  /**
   *
   * @type {Array<ValidationErrorFields>}
   * @memberof ValidationError
   */
  fields: ValidationErrorFields[]
  /**
   *
   * @type {Array<ValidationErrorErrors>}
   * @memberof ValidationError
   */
  general: ValidationErrorErrors[]
}
