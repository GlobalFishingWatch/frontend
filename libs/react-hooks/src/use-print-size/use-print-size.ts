import { useLayoutEffect,useState } from 'react'

export const getCSSVarValue = (property: string) => {
  if (typeof window !== 'undefined') {
    return window.getComputedStyle(document.body).getPropertyValue(property)
  }
  return ''
}

// TODO: review why it isn't always render propertly, disabled for now
export const isPrintSupported = false
// const browser = getParser(window.navigator.userAgent)
// export const isPrintSupported = browser.satisfies({
//   chrome: '>22',
//   opera: '>30',
//   edge: '>79',
// })

export type PrintSizeUnit = {
  px: number
  in: string
}
export type PrintSize = { width: PrintSizeUnit; height: PrintSizeUnit }

export function getPrintSize(printSize: PrintSize | undefined) {
  const size =
    printSize && isPrintSupported ? `${printSize?.width.in} ${printSize.height?.in}` : 'landscape'
  return size
}

export function usePrintSize() {
  const [printSize, setPrintSize] = useState<PrintSize | undefined>()

  useLayoutEffect(() => {
    const pixelPerInch = window.devicePixelRatio * 96
    const baseSize = parseInt(getCSSVarValue('--base-font-size')) || 10
    const timebarSize = parseFloat(getCSSVarValue('--timebar-size') || '7.2') * baseSize
    const height = window.innerHeight - timebarSize
    setPrintSize({
      width: {
        px: window.innerWidth,
        in: `${window.innerWidth / pixelPerInch}in`,
      },
      height: {
        in: `${height / pixelPerInch}in`,
        px: height,
      },
    })
  }, [])

  return getPrintSize(printSize)
}
