export function isNumeric(str: string | number) {
  if (!str) return false
  if (typeof str == 'number') return true
  return !isNaN(parseFloat(str))
}
