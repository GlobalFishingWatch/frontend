// Where the print starts new pages, worked out from the sidebar laid out with the print
// rules (see withPrintStyles): a box's position on paper follows from its DOM position.
//
// react-pdf has its own `break` / `wrap={false}`, but either makes it relayout the page with
// every box shrinkable, which collapses this tree. So the breaks are computed here and
// pdf-dom inserts a spacer filling the rest of the page, which plain splitting handles.

// A4 height minus the 1cm margins, in pt
export const PAGE_HEIGHT = ((29.7 - 2) / 2.54) * 72
// A box with break-after: avoid sticks to what follows when this close above it
const ADJACENT_PX = 32

const SKIPPED_TAGS = new Set(['INPUT', 'SELECT', 'TEXTAREA', 'SCRIPT', 'STYLE', 'NOSCRIPT'])

export const isSkipped = (element: Element, style: CSSStyleDeclaration) => {
  if (SKIPPED_TAGS.has(element.tagName)) return true
  if (style.display === 'none' || style.visibility === 'hidden') return true
  if (style.position === 'absolute' || style.position === 'fixed') return true
  return false
}

const isMedia = (element: Element) =>
  element instanceof SVGSVGElement ||
  element instanceof HTMLCanvasElement ||
  element instanceof HTMLImageElement

/** Grid children grouped by row, keyed by their top */
export function getGridRows(element: Element) {
  const rows = new Map<number, Element[]>()
  Array.from(element.children).forEach((child) => {
    if (isSkipped(child, getComputedStyle(child))) return
    const top = Math.round(child.getBoundingClientRect().top)
    rows.set(top, [...(rows.get(top) || []), child])
  })
  return rows
}

type PaginationParams = {
  /** pt per screen px */
  scale: number
  /** pt already used on the first page above `root` */
  offset: number
}

/** Elements that start a new page, with the pt of blank space left before them */
export function getPageBreaks(root: Element, { scale, offset }: PaginationParams) {
  const breaks = new Map<Element, number>()
  const originTop = root.getBoundingClientRect().top
  const stickyAbove: Element[] = []
  let shift = 0

  const pdfTop = (top: number) => offset + (top - originTop) * scale + shift
  const pageEnd = (pdfY: number) => (Math.floor(pdfY / PAGE_HEIGHT) + 1) * PAGE_HEIGHT

  // Like the browser, a break-after: avoid box above takes its last block along
  const getBreakTarget = (element: Element, top: number) => {
    const sticky = stickyAbove.findLast(
      (above) => Math.abs(above.getBoundingClientRect().bottom - top) <= ADJACENT_PX
    )
    const last = sticky && Array.from(sticky.children).findLast(
      (child) => !isSkipped(child, getComputedStyle(child))
    )
    if (!last) return { target: element, top }
    const lastTop = last.getBoundingClientRect().top
    // Only when it stays on the same page, otherwise moving it would leave a blank page
    const samePage = pageEnd(pdfTop(lastTop)) === pageEnd(pdfTop(top))
    return samePage ? { target: last, top: lastTop } : { target: element, top }
  }

  const breakBefore = (element: Element, top: number) => {
    const breakAt = getBreakTarget(element, top)
    const gap = pageEnd(pdfTop(top)) - pdfTop(breakAt.top)
    breaks.set(breakAt.target, gap)
    shift += gap
  }

  /** Whether the box was kept in one piece; boxes taller than a page are split */
  const keepTogether = (element: Element, top: number, height: number) => {
    const pdfHeight = height * scale
    const start = pdfTop(top)
    const end = pageEnd(start)
    if (start + pdfHeight <= end) return true
    // Taller than a page: the browser still starts it on a new page, then splits it
    const atPageTop = end - start >= PAGE_HEIGHT - 1
    if (!atPageTop) breakBefore(element, top)
    return pdfHeight < PAGE_HEIGHT
  }

  const visit = (element: Element) => {
    const style = getComputedStyle(element)
    if (isSkipped(element, style)) return
    const rect = element.getBoundingClientRect()
    if (isMedia(element)) {
      keepTogether(element, rect.top, rect.height)
      return
    }
    // scrollHeight: boxes sized to the viewport still print their overflowing content
    const height = Math.max(rect.height, element.scrollHeight)
    if (element.getAttribute('role') === 'tabpanel') console.warn('PDFDEBUG tabpanel', Math.round(rect.top), Math.round(rect.height), element.scrollHeight, style.breakInside, Math.round(pdfTop(rect.top)), Math.round(shift)) // DEBUG-REMOVE
    if (style.breakInside === 'avoid' && keepTogether(element, rect.top, height)) return
    if (style.display.includes('grid')) {
      getGridRows(element).forEach((cells, top) => {
        const bottom = Math.max(...cells.map((cell) => cell.getBoundingClientRect().bottom))
        keepTogether(cells[0], top, bottom - top)
      })
    } else {
      Array.from(element.children).forEach(visit)
    }
    if (style.breakAfter === 'avoid') stickyAbove.push(element)
  }

  visit(root)
  return breaks
}
