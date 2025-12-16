import Color from 'colorjs.io'

function relativeLuminance(color: Color): number {
  const [r, g, b] = color.to('srgb-linear').coords
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
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

  while (contrast < minContrast && adjustedColor.oklch.l > 0) {
    adjustFn(adjustedColor, 0.02)
    contrast = contrastFn(adjustedColor, backgroundColor)
  }

  return adjustedColor
}

export const getContrastSafeLineColor = (
  color: string,
  text: boolean = false,
  backgroundColor: string = '#F4F9FA'
) => {
  if (!color) {
    console.warn('No color provided using black as fallback', color)
    return '#000000'
  }
  const minContrastMichelson = 0.15
  const minContrastText = 1.8
  const colorA = new Color(color)
  const colorB = new Color(backgroundColor)

  if (text) {
    const adjustedColor = ensureMinimumContrast(
      colorA,
      colorB,
      minContrastText,
      contrastWCAG,
      (c, amount) => {
        c.oklch.l = Math.max(0, c.oklch.l - amount)
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
