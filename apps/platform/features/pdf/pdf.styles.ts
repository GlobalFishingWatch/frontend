import robotoCyrillic400 from '@fontsource/roboto/files/roboto-cyrillic-400-normal.woff?url'
import robotoCyrillic500 from '@fontsource/roboto/files/roboto-cyrillic-500-normal.woff?url'
import robotoGreek400 from '@fontsource/roboto/files/roboto-greek-400-normal.woff?url'
import robotoGreek500 from '@fontsource/roboto/files/roboto-greek-500-normal.woff?url'
import robotoLatin400 from '@fontsource/roboto/files/roboto-latin-400-normal.woff?url'
import robotoLatin500 from '@fontsource/roboto/files/roboto-latin-500-normal.woff?url'
import robotoLatinExt400 from '@fontsource/roboto/files/roboto-latin-ext-400-normal.woff?url'
import robotoLatinExt500 from '@fontsource/roboto/files/roboto-latin-ext-500-normal.woff?url'
import robotoVietnamese400 from '@fontsource/roboto/files/roboto-vietnamese-400-normal.woff?url'
import robotoVietnamese500 from '@fontsource/roboto/files/roboto-vietnamese-500-normal.woff?url'
import { Font, StyleSheet } from '@react-pdf/renderer'

// The PDF reproduces the browser print, where 1 CSS px is 0.75 pt (96 dpi)
export const px = (value: number) => value * 0.75

// @fontsource only ships Roboto split by unicode subset; react-pdf falls back through the
// list per glyph, which is what `unicode-range` does in the browser.
const ROBOTO_SUBSETS = {
  Roboto: [robotoLatin400, robotoLatin500],
  'Roboto-latin-ext': [robotoLatinExt400, robotoLatinExt500],
  'Roboto-cyrillic': [robotoCyrillic400, robotoCyrillic500],
  'Roboto-greek': [robotoGreek400, robotoGreek500],
  'Roboto-vietnamese': [robotoVietnamese400, robotoVietnamese500],
}
export const FONT_FAMILY = Object.keys(ROBOTO_SUBSETS)

let fontsRegistered = false
export function registerPdfFonts() {
  if (fontsRegistered) return
  Object.entries(ROBOTO_SUBSETS).forEach(([family, [regular, bold]]) => {
    Font.register({
      family,
      fonts: [
        { src: regular, fontWeight: 400 },
        { src: bold, fontWeight: 500 },
      ],
    })
  })
  // Browsers never hyphenate here, react-pdf does by default
  Font.registerHyphenationCallback((word) => [word])
  fontsRegistered = true
}

// Print forces --color-primary-blue to black inside the sidebar (layouts.module.css)
export const COLORS = {
  text: '#000000',
  primaryBlue: '#163f89',
  secondaryBlue: 'rgba(22, 63, 137, 0.72)',
  terthiaryBlue: 'rgba(22, 63, 137, 0.1)',
  border: 'rgba(22, 63, 137, 0.12)',
  borderThick: 'rgba(22, 63, 137, 0.22)',
  offWhite: '#f6f6f8',
  white: '#ffffff',
  mapBackground: '#002457',
}

// Same scale as the --font-* tokens in libs/ui-components/src/base.css
const font = (size: number, lineHeight: number, fontWeight = 400) => ({
  fontSize: px(size),
  lineHeight: lineHeight / size,
  fontWeight,
})
export const FONTS = {
  XS: font(12, 12),
  XSBold: font(12, 12, 500),
  S: font(14, 22),
  SBold: font(14, 22, 500),
  M: font(16, 24),
  MBold: font(16, 24, 500),
  L: font(20, 30),
  LBold: font(20, 30, 500),
}

export const SPACE = {
  XS: px(4),
  S: px(8),
  SM: px(16),
  M: px(24),
  L: px(40),
}

export const pdfStyles = StyleSheet.create({
  page: {
    // @page { margin: 1cm } in layouts.module.css
    padding: '1cm',
    fontFamily: FONT_FAMILY,
    color: COLORS.text,
    ...FONTS.M,
  },
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: px(12),
    marginVertical: SPACE.S,
  },
  // Global `label` rule in libs/ui-components/src/base.css
  label: {
    ...FONTS.S,
    textTransform: 'uppercase',
    letterSpacing: px(14 * 0.03),
  },
})
