export function isNumeric(str: string | number) {
  if (str === undefined || str === null) return false
  const regex = /^-?\d*\.?\d+$/
  if (typeof str == 'number') return true
  return regex.test(str.toString())
}
