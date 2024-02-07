export function isNumeric(str: string | number) {
  if (typeof str == 'number') return true
  return !isNaN(parseFloat(str))
}
