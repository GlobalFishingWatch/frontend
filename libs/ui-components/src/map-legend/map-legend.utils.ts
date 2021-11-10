export const parseLegendNumber = (number: number) => {
  if (typeof number !== 'number') {
    return number
  }
  return number % 1 === 0 ? number : parseFloat(number.toFixed(2))
}

export const roundLegendNumber = (number: number) => {
  return number > 1 ? Math.floor(number) : parseLegendNumber(number)
}

export const formatLegendValue = (number: number) => {
  if (typeof number !== 'number') {
    console.warn('Value not valid be fixed parsed, returning original value', number)
    return number
  }
  if (number >= 1000000) return `${(number / 1000000).toFixed(2).replace(/\.?0+$/, '')}M`
  if (number >= 1000) return `${(number / 1000).toFixed(1).replace(/\.?0+$/, '')}K`
  if (number < 1) return `${number.toFixed(2)}`
  return number.toFixed(0)
}
