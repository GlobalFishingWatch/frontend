// The app already describes its printed look in `@media print` rules. Rather than repeat
// them for the PDF, they are applied to the screen while the sidebar is read: the DOM then
// has the print layout (19cm wide sidebar, hidden controls, expanded lists) and computed
// styles are the printed ones. An overlay hides the reflow.

const PRINT_WIDTH_PX = (19 / 2.54) * 96

function collectPrintRules(rules: CSSRuleList, output: string[], inPrint = false) {
  Array.from(rules).forEach((rule) => {
    if (rule instanceof CSSMediaRule) {
      const isPrint = Array.from(rule.media).some((medium) => medium.includes('print'))
      collectPrintRules(rule.cssRules, output, inPrint || isPrint)
    } else if (rule instanceof CSSStyleRule) {
      if (inPrint) output.push(rule.cssText)
    } else if ('cssRules' in rule && !(rule instanceof CSSPageRule)) {
      collectPrintRules((rule as CSSGroupingRule).cssRules, output, inPrint)
    }
  })
}

function getPrintCss() {
  const output: string[] = []
  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      collectPrintRules(sheet.cssRules, output)
    } catch {
      // Cross-origin stylesheets (fonts) cannot be read and have no print rules
    }
  })
  return output.join('\n')
}

const waitForFrames = (frames = 2) =>
  new Promise<void>((resolve) => {
    const tick = (remaining: number) =>
      remaining ? requestAnimationFrame(() => tick(remaining - 1)) : resolve()
    tick(frames)
  })

/** Applies the print rules, runs `read` once the layout settled, then restores the page. */
export async function withPrintStyles<T>(read: () => T): Promise<T> {
  const overlay = document.createElement('div')
  overlay.style.cssText =
    'position:fixed;inset:0;z-index:100000;background:rgba(255,255,255,0.9);cursor:progress;'
  const style = document.createElement('style')
  // The print sheet is laid out at the A4 content width
  style.textContent = `${getPrintCss()}\n#__root__ { width: ${PRINT_WIDTH_PX}px !important; }`
  document.body.append(overlay, style)
  try {
    await waitForFrames()
    // Charts re-measure on resize (recharts ResponsiveContainer debounces it)
    window.dispatchEvent(new Event('resize'))
    await new Promise((resolve) => setTimeout(resolve, 500))
    await waitForFrames()
    return read()
  } finally {
    style.remove()
    window.dispatchEvent(new Event('resize'))
    overlay.remove()
  }
}
