/**
 * Google Sheets formula-injection guards.
 *
 * A cell whose text starts with `=`, `+`, `-`, `@` (or a tab/CR) is interpreted as a
 * formula. User-supplied strings written to a sheet must therefore be neutralized so a
 * value like `=IMPORTXML(...)` cannot exfiltrate data or run when an analyst opens the
 * sheet. See https://owasp.org/www-community/attacks/CSV_Injection.
 */

const FORMULA_TRIGGER = /^[=+\-@\t\r]/

/**
 * Neutralize a single value destined for a sheet cell. Strings that look like a formula
 * are prefixed with a single quote (forces literal text in Sheets); non-strings pass
 * through untouched. Do NOT use this on app-generated formula cells.
 */
export function sanitizeSheetValue<T>(value: T): T {
  if (typeof value === 'string' && FORMULA_TRIGGER.test(value)) {
    return `'${value}` as unknown as T
  }
  return value
}

/**
 * Neutralize every string value of a flat row object. Use at the `addRow` boundary for
 * rows built entirely from user input.
 */
export function sanitizeSheetRow<T extends Record<string, unknown>>(row: T): T {
  const sanitized: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    sanitized[key] = sanitizeSheetValue(value)
  }
  return sanitized as T
}

/**
 * Escape a user value that is interpolated INTO an app-generated formula string literal,
 * e.g. `=HYPERLINK("<here>", ...)`. Doubles quotes (Sheets string escaping) and collapses
 * newlines so the value cannot break out of the string and inject formula syntax.
 */
export function escapeFormulaString(value: string | undefined | null): string {
  return (value ?? '').replace(/"/g, '""').replace(/[\r\n]+/g, ' ')
}
