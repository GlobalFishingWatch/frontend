export const DECK_FONT = 'DeckFont'

export function loadDeckFont() {
  return new Promise<boolean>((resolve) => {
    if (typeof document === 'undefined') {
      return resolve(false)
    }
    const font = new FontFace(
      DECK_FONT,
      "url('https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2')"
    )
    font
      .load()
      .then(() => {
        ;(document.fonts as any).add(font)
      })
      .finally(() => {
        resolve(true)
      })
  })
}
