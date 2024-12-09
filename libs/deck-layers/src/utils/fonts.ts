const DECK_FONT = 'Roboto Deck'

export function loadDeckFont() {
  return new Promise<boolean>((resolve) => {
    if (typeof document === 'undefined') {
      return resolve(false)
    }
    const fontLoaded = document.fonts.check(`1em ${DECK_FONT}`)
    if (!fontLoaded) {
      const font = new FontFace(
        DECK_FONT,
        "url('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2')"
      )
      font
        .load()
        .then(() => {
          ;(document.fonts as any).add(font)
        })
        .finally(() => {
          resolve(fontLoaded)
        })
    } else {
      resolve(fontLoaded)
    }
  })
}
