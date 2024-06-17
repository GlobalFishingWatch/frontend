export function isNumeric(str: string | number) {
  const regex = /^-?\d*\.?\d+$/
  if (typeof str == 'number') return true
  return regex.test(str.toString())
}
