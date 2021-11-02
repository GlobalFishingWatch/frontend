export const parseLegendNumber = (number: number) => {
  if (typeof number !== 'number') {
    return number
  }
  return number % 1 === 0 ? number : parseFloat(number.toFixed(2))
}

export const roundLegendNumber = (number: number) => {
  return Math.abs(number) > 1 ? Math.floor(number) : parseLegendNumber(number)
}

export const formatLegendValue = (
  number: number,
  isFirst?: boolean,
  isLast?: boolean,
  divergent?: boolean
) => {
  if (typeof number !== 'number') {
    console.warn('Value not valid be fixed parsed, returning original value', number)
    return number
  }
  let formattedValue = number.toFixed(0)
  if (number === 0) formattedValue = '0'
  else if (Math.abs(number) >= 1000000)
    formattedValue = `${(number / 1000000).toFixed(2).replace(/\.?0+$/, '')}M`
  else if (Math.abs(number) >= 1000)
    formattedValue = `${(number / 1000).toFixed(1).replace(/\.?0+$/, '')}K`
  else if (Math.abs(number) < 1) formattedValue = `${number.toFixed(2)}`

  if (divergent && number > 0 && !isLast) {
    formattedValue = ['+', formattedValue].join('')
  }
  if (isFirst && !isNaN(number) && divergent) formattedValue = `≤${formattedValue}`
  if (isLast && !isNaN(number)) formattedValue = `≥${formattedValue}`

  return formattedValue
}
