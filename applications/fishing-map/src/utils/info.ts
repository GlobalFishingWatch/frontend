export const formatInfoField = (fieldValue: string, type: string) => {
  if (type === 'name')
    return fieldValue.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  if (type === 'fleet') {
    const fleetClean = fieldValue.replaceAll('_', ' ')
    return fleetClean.charAt(0).toUpperCase() + fleetClean.slice(1)
  }
  return fieldValue
}

export const formatNumber = (num: string | number) => {
  const number = typeof num === 'string' ? parseFloat(num) : num
  return number.toLocaleString(undefined, {
    maximumFractionDigits: number < 10 ? 2 : 0,
  })
}
