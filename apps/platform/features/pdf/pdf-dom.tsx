import type { ReactNode } from 'react'
import { Image, Link, Text, View } from '@react-pdf/renderer'

import { px } from './pdf.styles'
import { getGridRows, getPageBreaks, isSkipped } from './pdf-pagination'
import { svgToPdf } from './pdf-svg'

// Rendered sidebar DOM → react-pdf tree, reading the browser's computed styles. Run it
// inside `withPrintStyles` so those are the printed ones.
//
// Only what the sidebar uses is mapped: block / flex / grid boxes, inline text runs, SVG,
// images and canvases. Absolutely positioned overlays (tooltips, popovers) are skipped.

type Box = { width: number }

const AUTO_MARGIN_THRESHOLD = 64

type Context = {
  /** pt per screen px for sizes that come from layout (svg, images, fixed boxes) */
  scale: number
  /** Keep every box at its painted height (HTML drawn over a chart, positioned by it) */
  fixedHeights?: boolean
  /** Elements that start a new page and the blank pt left before them */
  breaks: Map<Element, number>
}

const isTransparent = (color: string) =>
  color === 'transparent' || color === 'rgba(0, 0, 0, 0)' || color === ''

const isInlineLevel = (style: CSSStyleDeclaration) => style.display === 'inline'

const isInlineBlockLevel = (style: CSSStyleDeclaration) =>
  style.display === 'inline-block' ||
  style.display === 'inline-flex' ||
  style.display === 'inline-grid'

function getTextStyle(style: CSSStyleDeclaration) {
  const fontSize = parseFloat(style.fontSize)
  const lineHeight = parseFloat(style.lineHeight)
  const textStyle: Record<string, string | number> = {
    fontSize: px(fontSize),
    fontWeight: parseInt(style.fontWeight) >= 500 ? 500 : 400,
    color: style.color,
  }
  if (fontSize > 0 && !Number.isNaN(lineHeight)) textStyle.lineHeight = lineHeight / fontSize
  if (style.textTransform !== 'none') textStyle.textTransform = style.textTransform
  const letterSpacing = parseFloat(style.letterSpacing)
  if (!Number.isNaN(letterSpacing) && letterSpacing !== 0)
    textStyle.letterSpacing = px(letterSpacing)
  if (style.textDecorationLine.includes('underline')) textStyle.textDecoration = 'underline'
  if (style.fontStyle === 'italic') textStyle.fontStyle = 'italic'
  if (style.textAlign === 'right' || style.textAlign === 'center' || style.textAlign === 'end') {
    textStyle.textAlign = style.textAlign === 'end' ? 'right' : style.textAlign
  }
  return textStyle
}

// Decoration drawn by absolutely positioned ::before / ::after boxes: the tint of tags
// (currentColor at border opacity over the whole tag) and the separators between events.
// Each becomes an absolute View at the size and offset the browser resolved.
function convertPseudoBoxes(element: Element, context: Context) {
  return (['::before', '::after'] as const).flatMap((pseudo) => {
    const style = getComputedStyle(element, pseudo)
    if (style.content === 'none' || style.display === 'none' || style.position !== 'absolute') {
      return []
    }
    if (isTransparent(style.backgroundColor)) return []
    const size = (value: string) => parseFloat(value) * context.scale
    return [
      <View
        key={pseudo}
        style={{
          position: 'absolute',
          left: size(style.left),
          top: size(style.top),
          width: size(style.width),
          height: size(style.height),
          backgroundColor: style.backgroundColor,
          opacity: parseFloat(style.opacity),
          ...(parseFloat(style.borderTopLeftRadius) > 0 && {
            borderRadius: size(style.borderTopLeftRadius),
          }),
        }}
      />,
    ]
  })
}

function getBoxStyle(element: Element, style: CSSStyleDeclaration) {
  const box: Record<string, string | number> = {}
  const sides = ['Top', 'Right', 'Bottom', 'Left'] as const
  sides.forEach((side) => {
    const margin = parseFloat(style[`margin${side}`])
    // Computed styles resolve `margin: auto` to the free space; no spacing token is this big
    if ((side === 'Left' || side === 'Right') && margin > AUTO_MARGIN_THRESHOLD) {
      box[`margin${side}`] = 'auto'
    } else if (margin > 0) {
      // Collapsed/negative margins have no flexbox equivalent worth chasing
      box[`margin${side}`] = px(margin)
    }
    let padding = parseFloat(style[`padding${side}`])
    // A fixed-height box whose content runs a little past it (table cells are 4rem with a
    // 24px line inside) keeps its painted height: the overflow eats into the padding
    const overflow = element.scrollHeight - element.clientHeight
    if (side === 'Bottom' && overflow > 0 && overflow <= padding) padding -= overflow
    if (padding > 0) box[`padding${side}`] = px(padding)
    const border = parseFloat(style[`border${side}Width`])
    if (border > 0 && style[`border${side}Style`] !== 'none') {
      box[`border${side}Width`] = px(border)
      box[`border${side}Color`] = style[`border${side}Color`]
    }
  })
  const radius = parseFloat(style.borderTopLeftRadius)
  if (radius > 0)
    box.borderRadius = Math.min(px(radius), px(element.getBoundingClientRect().height / 2))
  if (!isTransparent(style.backgroundColor)) box.backgroundColor = style.backgroundColor
  if (style.opacity !== '1') box.opacity = parseFloat(style.opacity)
  return box
}

function getLayoutStyle(style: CSSStyleDeclaration) {
  const layout: Record<string, string | number> = {}
  const isFlex = style.display.includes('flex')
  const isGrid = style.display.includes('grid')
  if (isFlex) {
    layout.flexDirection = style.flexDirection.startsWith('row') ? 'row' : 'column'
    if (style.flexWrap !== 'nowrap') layout.flexWrap = style.flexWrap
  } else if (isGrid) {
    // Grid children are regrouped into one row View per grid row, see convertGridRows
    layout.flexDirection = 'column'
  } else {
    layout.flexDirection = 'column'
  }
  if (isFlex || isGrid) {
    const justify = style.justifyContent
    if (justify.includes('between')) layout.justifyContent = 'space-between'
    else if (justify.includes('end')) layout.justifyContent = 'flex-end'
    else if (justify.includes('center')) layout.justifyContent = 'center'
    const align = style.alignItems
    if (align.includes('center')) layout.alignItems = 'center'
    else if (align.includes('end')) layout.alignItems = 'flex-end'
    else if (align.includes('start') || align.includes('baseline')) layout.alignItems = 'flex-start'
    const rowGap = parseFloat(style.rowGap)
    const columnGap = parseFloat(style.columnGap)
    if (rowGap > 0) layout.rowGap = px(rowGap)
    if (columnGap > 0) layout.columnGap = px(columnGap)
  }
  return layout
}

// Whitespace collapses across inline elements too: a space ending one run swallows the
// one starting the next, and the line box starts without one. `clipped` holds how much of
// each text node is visible when the line is cut with an ellipsis.
type InlineState = { afterSpace: boolean; clipped?: Map<Node, number> }

function convertText(text: string, state: InlineState, node?: Node) {
  const visible = node && state.clipped?.get(node)
  const source = visible === undefined ? text : visible < 0 ? '' : `${text.slice(0, visible)}…`
  let collapsed = source.replace(/\s+/g, ' ')
  if (state.afterSpace) collapsed = collapsed.replace(/^ /, '')
  if (collapsed) state.afterSpace = collapsed.endsWith(' ')
  return collapsed
}

// The box carrying `text-overflow: ellipsis` may wrap the text in a few inline elements
function getEllipsisContainer(element: Element) {
  let current: Element | null = element
  for (let depth = 0; current && depth < 4; depth++, current = current.parentElement) {
    if (getComputedStyle(current).textOverflow === 'ellipsis') return current
  }
  return undefined
}

const ELLIPSIS = '…'
let measureContext: CanvasRenderingContext2D | null = null

// `text-overflow: ellipsis` cuts at a character, which react-pdf cannot do (it breaks at
// words and hyphenates). The cut the browser made is read back from the character boxes.
function getClippedText(container: Element, style: CSSStyleDeclaration) {
  const rect = container.getBoundingClientRect()
  const right = rect.right - parseFloat(style.paddingRight) - parseFloat(style.borderRightWidth)
  if (container.scrollWidth <= container.clientWidth) return undefined
  measureContext ??= document.createElement('canvas').getContext('2d')
  if (!measureContext) return undefined
  measureContext.font = style.font
  const limit = right - measureContext.measureText(ELLIPSIS).width
  const clipped = new Map<Node, number>()
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  let cut = false
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (cut) {
      clipped.set(node, -1)
      continue
    }
    const length = node.textContent?.length || 0
    for (let i = 0; i < length; i++) {
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      if (range.getBoundingClientRect().right > limit) {
        clipped.set(node, i)
        cut = true
        break
      }
    }
  }
  return cut ? clipped : undefined
}

/** Text a ::before / ::after rule renders, e.g. the " - " after a printable graph title */
function getPseudoText(element: Element, pseudo: '::before' | '::after') {
  const content = getComputedStyle(element, pseudo).content
  return content.startsWith('"') ? content.slice(1, -1) : ''
}

function convertInline(node: Node, key: number, state: InlineState): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) return convertText(node.textContent || '', state, node)
  if (node.nodeType !== Node.ELEMENT_NODE) return null
  const element = node as HTMLElement
  const style = getComputedStyle(element)
  if (isSkipped(element, style)) return null
  if (element.tagName === 'BR') {
    state.afterSpace = true
    return '\n'
  }
  const children = [
    convertText(getPseudoText(element, '::before'), state),
    ...Array.from(element.childNodes).map((child, i) => convertInline(child, i, state)),
    convertText(getPseudoText(element, '::after'), state),
  ]
  const textStyle = getTextStyle(style)
  if (!isTransparent(style.backgroundColor)) textStyle.backgroundColor = style.backgroundColor
  if (element.tagName === 'A' && (element as HTMLAnchorElement).href) {
    return (
      <Link key={key} src={(element as HTMLAnchorElement).href} style={textStyle}>
        {children}
      </Link>
    )
  }
  return (
    <Text key={key} style={textStyle}>
      {children}
    </Text>
  )
}

const getLineHeight = (style: CSSStyleDeclaration) => {
  const lineHeight = parseFloat(style.lineHeight)
  return px(Number.isNaN(lineHeight) ? parseFloat(style.fontSize) * 1.2 : lineHeight)
}

const hasVisibleText = (nodes: Node[]) => nodes.some((node) => node.textContent?.trim())

function convertInlineGroup(
  nodes: Node[],
  parent: Element,
  parentStyle: CSSStyleDeclaration,
  key: string,
  inLine = false
) {
  if (!hasVisibleText(nodes)) return null
  const singleLine = parentStyle.whiteSpace === 'nowrap'
  const clipper = singleLine ? getEllipsisContainer(parent) : undefined
  const state: InlineState = {
    afterSpace: true,
    clipped: clipper && getClippedText(clipper, getComputedStyle(clipper)),
  }
  const runs = nodes.map((node, i) => convertInline(node, i, state))
  // Trim the whitespace at the end of the line box, as the browser does
  const last = runs.findLastIndex((run) => run !== null)
  if (typeof runs[last] === 'string') runs[last] = (runs[last] as string).trimEnd()
  // nowrap text is clipped to one line; the tables mark the cut with an ellipsis
  return (
    <Text
      key={key}
      style={{
        ...getTextStyle(parentStyle),
        // In case the PDF font runs wider than the browser's: stay on one line. react-pdf
        // shrinks every box to fit a fixed-height parent (flexShrink 0 is not honored), and
        // drops a line that ends up shorter than its line height.
        ...(singleLine && { maxLines: 1, minHeight: getLineHeight(parentStyle) }),
        // Next to inline boxes, the text takes the room left on the line
        ...(singleLine && inLine && { flexGrow: 1, flexBasis: 0 }),
      }}
    >
      {runs}
    </Text>
  )
}

function convertMedia(element: Element, rect: DOMRect, context: Context, key: number) {
  const width = rect.width * context.scale
  if (element instanceof SVGSVGElement) {
    if (!rect.width || !rect.height) return null
    const height = rect.height * context.scale
    return withPageBreak(
      context.breaks.get(element),
      <View key={key} style={{ width, height }}>
        {svgToPdf(element, { width, height })}
        {Array.from(element.querySelectorAll('foreignObject')).map((foreignObject, i) =>
          convertForeignObject(foreignObject, rect, context, i)
        )}
      </View>,
      key
    )
  }
  if (element instanceof HTMLCanvasElement) {
    if (!element.width) return null
    return (
      <Image
        key={key}
        src={element.toDataURL('image/png')}
        style={{ width, height: rect.height * context.scale }}
      />
    )
  }
  if (element instanceof HTMLImageElement && element.complete && element.naturalWidth) {
    return (
      <Image
        key={key}
        src={element.currentSrc}
        style={{ width, height: rect.height * context.scale }}
      />
    )
  }
  return null
}

// HTML embedded in an SVG (the individual vessels bar chart) cannot go into a react-pdf
// Svg: it is converted as boxes laid over the chart at the same place
function convertForeignObject(
  foreignObject: Element,
  svgRect: DOMRect,
  context: Context,
  key: number
) {
  const rect = foreignObject.getBoundingClientRect()
  const { scale } = context
  return (
    <View
      key={`foreign-${key}`}
      style={{
        position: 'absolute',
        left: (rect.left - svgRect.left) * scale,
        top: (rect.top - svgRect.top) * scale,
        width: rect.width * scale,
        height: rect.height * scale,
      }}
    >
      {Array.from(foreignObject.children).map((child, i) =>
        convertElement(child, { width: rect.width }, { ...context, fixedHeights: true }, i)
      )}
    </View>
  )
}

function convertElement(
  element: Element,
  parentBox: Box,
  context: Context,
  key: number
): ReactNode {
  const style = getComputedStyle(element)
  if (isSkipped(element, style)) return null
  const rect = element.getBoundingClientRect()

  if (
    element instanceof SVGSVGElement ||
    element instanceof HTMLCanvasElement ||
    element instanceof HTMLImageElement
  ) {
    return convertMedia(element, rect, context, key)
  }
  if (style.display === 'contents') {
    return convertChildren(element, style, parentBox, context)
  }

  const box = getBoxStyle(element, style)
  // The browser truncates the top margin of a box pushed to a new page
  if (context.breaks.has(element)) delete box.marginTop
  const layout = getLayoutStyle(style)
  const contentWidth =
    rect.width -
    parseFloat(style.paddingLeft) -
    parseFloat(style.paddingRight) -
    parseFloat(style.borderLeftWidth) -
    parseFloat(style.borderRightWidth)
  const children = convertChildren(element, style, { width: contentWidth }, context)

  const size: Record<string, string | number> = {}
  const parentStyle = element.parentElement ? getComputedStyle(element.parentElement) : undefined
  const inRow =
    parentStyle &&
    ((parentStyle.display.includes('flex') && parentStyle.flexDirection.startsWith('row')) ||
      parentStyle.display.includes('grid'))
  if (inRow) {
    const grow = parseFloat(style.flexGrow)
    if (grow > 0) {
      size.flexGrow = grow
      size.flexBasis = 0
    } else if (context.fixedHeights) {
      size.width = rect.width * context.scale
    } else if (parentBox.width > 0) {
      // Keep the proportions of the screen layout at the page width
      size.width = `${Math.min(100, (rect.width / parentBox.width) * 100)}%`
    }
    size.flexShrink = parseFloat(style.flexShrink) || 0
  }
  if (context.fixedHeights) size.height = rect.height * context.scale
  if (!children || (Array.isArray(children) && children.every((child) => !child))) {
    // Empty boxes are decoration (dots, bars, separators): keep their painted size
    if (!box.backgroundColor && !Object.keys(box).some((k) => k.startsWith('border'))) return null
    size.width = rect.width * context.scale
    size.height = rect.height * context.scale
  }

  return withPageBreak(
    context.breaks.get(element),
    <View key={key} style={{ ...layout, ...box, ...size }}>
      {/* First, so content paints over it as in the browser (z-index 0) */}
      {convertPseudoBoxes(element, context)}
      {children}
    </View>,
    key
  )
}

// A spacer filling the rest of the page moves the node to the next one (see pdf-pagination)
const withPageBreak = (gap: number | undefined, node: ReactNode, key: number | string) =>
  gap ? [<View key={`break-${key}`} style={{ height: gap }} />, node] : node

// A grid (the vessels table) as one wrapping row of cells cannot be paginated by react-pdf.
// Rows are rebuilt from the cells' positions so pages break between rows, as in print.
function convertGridRows(element: Element, style: CSSStyleDeclaration, box: Box, context: Context) {
  const columnGap = parseFloat(style.columnGap)
  return Array.from(getGridRows(element).values()).map((cells, i) => {
    return withPageBreak(
      context.breaks.get(cells[0]),
      <View
        key={i}
        style={{
          flexDirection: 'row',
          ...(columnGap > 0 && { columnGap: px(columnGap) }),
        }}
      >
        {cells.map((cell, j) => convertElement(cell, box, context, j))}
      </View>,
      i
    )
  })
}

function convertChildren(
  element: Element,
  style: CSSStyleDeclaration,
  box: Box,
  context: Context
): ReactNode[] {
  if (style.display.includes('grid')) return convertGridRows(element, style, box, context)
  const output: ReactNode[] = []
  let inlineRun: Node[] = []
  let inlineBlockRun: Element[] = []

  const flushInline = () => {
    if (inlineRun.length) {
      output.push(convertInlineGroup(inlineRun, element, style, `inline-${output.length}`, mixed))
    }
    inlineRun = []
  }
  const isFlowParent = !style.display.includes('flex') && !style.display.includes('grid')
  // Text next to inline boxes (a color dot before a vessel name) shares their line
  const childElements = Array.from(element.children)
  const mixed =
    isFlowParent &&
    childElements.some((child) => isInlineBlockLevel(getComputedStyle(child))) &&
    hasVisibleText(
      Array.from(element.childNodes).filter(
        (child) =>
          child.nodeType === Node.TEXT_NODE || isInlineLevel(getComputedStyle(child as Element))
      )
    )

  const flushInlineBlocks = () => {
    if (mixed) {
      output.push(...inlineBlockRun.map((child, i) => convertElement(child, box, context, i)))
    } else if (inlineBlockRun.length) {
      output.push(
        <View
          key={`inline-blocks-${output.length}`}
          style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}
        >
          {inlineBlockRun.map((child, i) => convertElement(child, box, context, i))}
        </View>
      )
    }
    inlineBlockRun = []
  }

  const before = getPseudoText(element, '::before')
  const after = getPseudoText(element, '::after')
  const childNodes = [
    ...(before ? [document.createTextNode(before)] : []),
    ...Array.from(element.childNodes),
    ...(after ? [document.createTextNode(after)] : []),
  ]
  childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      flushInlineBlocks()
      inlineRun.push(child)
      return
    }
    if (child.nodeType !== Node.ELEMENT_NODE) return
    const childElement = child as Element
    const childStyle = getComputedStyle(childElement)
    if (isInlineLevel(childStyle) && !(childElement instanceof SVGSVGElement)) {
      flushInlineBlocks()
      inlineRun.push(child)
      return
    }
    flushInline()
    if (isFlowParent && isInlineBlockLevel(childStyle)) {
      inlineBlockRun.push(childElement)
      return
    }
    flushInlineBlocks()
    output.push(convertElement(childElement, box, context, output.length))
  })
  flushInline()
  flushInlineBlocks()
  if (!mixed) return output
  return [
    <View
      key="line"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: style.whiteSpace === 'nowrap' ? 'nowrap' : 'wrap',
      }}
    >
      {output}
    </View>,
  ]
}

/**
 * Converts `element` and its subtree to fit `width` pt. `offset` is the pt already used on
 * the first page, so page breaks land where the print puts them.
 */
export function domToPdf(
  element: Element,
  { width, offset = 0 }: { width: number; offset?: number }
) {
  const rect = element.getBoundingClientRect()
  const scale = rect.width ? width / rect.width : 0.75
  const context: Context = { scale, breaks: getPageBreaks(element, { scale, offset }) }
  return convertElement(element, { width: rect.width }, context, 0)
}
