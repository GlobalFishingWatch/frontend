/**
 * Parses a value that should be a number but arrives untyped — a tile/GeoJSON feature property,
 * a response header, a URL param.
 *
 * Guards against the values `Number()` coerces silently: `null`, `undefined` and `''` all become
 * `0`, which reads as a legitimate measurement. `0` itself is preserved.
 */
export const toFiniteNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}
