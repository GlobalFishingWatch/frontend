const DECIMALS = 2

export const parseLegendNumber = (number: number) => {
  if (typeof number !== 'number') {
    return number
  }
  return number % 1 === 0 ? number : parseFloat(number.toFixed(DECIMALS))
}

export const roundLegendNumber = (number: number) => {
  return Math.abs(number) > 1 ? Math.floor(number) : parseLegendNumber(number)
}

export type FormatLegendValueParams = {
  number: number
  roundValues?: boolean
  isFirst?: boolean
  isLast?: boolean
  divergent?: boolean
}
export const formatLegendValue = ({
  number,
  roundValues,
  isFirst,
  isLast,
  divergent,
}: FormatLegendValueParams) => {
  if (typeof number !== 'number') {
    console.warn('Value not valid be fixed parsed, returning original value', number)
    return number
  }
  let formattedValue = roundValues ? number.toFixed(0) : number.toFixed(DECIMALS)
  if (number === 0) formattedValue = '0'
  else if (Math.abs(number) >= 1000000000)
    formattedValue = `${(number / 1000000000).toFixed(DECIMALS).replace(/\.?0+$/, '')}B`
  else if (Math.abs(number) >= 1000000)
    formattedValue = `${(number / 1000000).toFixed(DECIMALS).replace(/\.?0+$/, '')}M`
  else if (Math.abs(number) >= 1000)
    formattedValue = `${(number / 1000).toFixed(1).replace(/\.?0+$/, '')}K`
  else if (Math.abs(number) < 1) formattedValue = `${number.toFixed(DECIMALS)}`

  if (divergent && number > 0 && !isLast) {
    formattedValue = ['+', formattedValue].join('')
  }
  if (isFirst && !isNaN(number) && divergent) formattedValue = `≤${formattedValue}`
  if (isLast && !isNaN(number)) formattedValue = `≥${formattedValue}`

  return formattedValue
}
