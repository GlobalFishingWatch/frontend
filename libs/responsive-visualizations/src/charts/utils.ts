import Color from 'colorjs.io'

export const getContrastSafeLineColor = (color: string, backgroundColor: string = '#F4F9FA') => {
  if (!color) {
    console.warn('No color provided using black as fallback', color)
    return '#000000'
  }
  const minContrastMichelson = 0.15
  const colorA = new Color(color)
  const colorB = new Color(backgroundColor)
  const contrast = colorA.contrastMichelson(colorB)
  if (contrast < minContrastMichelson) {
    colorA.darken(minContrastMichelson - contrast)
  }
  return colorA.toString()
}
