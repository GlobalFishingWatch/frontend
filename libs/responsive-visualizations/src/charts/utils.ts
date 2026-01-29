import Color from 'colorjs.io'

function relativeLuminance(color: Color): number {
  const [r, g, b] = color.to('srgb-linear').coords
  // Handle null values (representing 'none' in colorjs.io v0.6.0+)
  const rVal = r ?? 0
  const gVal = g ?? 0
  const bVal = b ?? 0
  return 0.2126 * rVal + 0.7152 * gVal + 0.0722 * bVal
}

function contrastWCAG(colorA: Color, colorB: Color): number {
  const L1 = relativeLuminance(colorA)
  const L2 = relativeLuminance(colorB)
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

function ensureMinimumContrast(
  color: Color,
  backgroundColor: Color,
  minContrast: number,
  contrastFn: (a: Color, b: Color) => number,
  adjustFn: (c: Color, amount: number) => void
): Color {
  const adjustedColor = color.clone()
  let contrast = contrastFn(adjustedColor, backgroundColor)

  while (contrast < minContrast && (adjustedColor.oklch.l ?? 0) > 0) {
    adjustFn(adjustedColor, 0.02)
    contrast = contrastFn(adjustedColor, backgroundColor)
  }

  return adjustedColor
}

export const getContrastSafeColor = (
  color: string,
  type: 'line' | 'text' = 'line',
  backgroundColor: string = '#F4F9FA'
) => {
  if (!color) {
    console.warn('No color provided using black as fallback', color)
    return '#000000'
  }
  if (!Color.try(color) || !Color.try(backgroundColor)) {
    console.warn('Error with color:', color)
    return '#000000'
  }

  const minContrastMichelson = 0.15
  const minContrastText = 1.8
  const colorA = new Color(color)
  const colorB = new Color(backgroundColor)

  if (type === 'text') {
    const adjustedColor = ensureMinimumContrast(
      colorA,
      colorB,
      minContrastText,
      contrastWCAG,
      (c, amount) => {
        const currentL = c.oklch.l ?? 0
        c.oklch.l = Math.max(0, currentL - amount)
      }
    )
    return adjustedColor.toString()
  }

  const contrast = colorA.contrastMichelson(colorB)
  if (contrast < minContrastMichelson) {
    colorA.darken(minContrastMichelson - contrast)
  }
  return colorA.toString()
}
