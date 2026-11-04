import type { ComponentType, ReactElement, ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Text,
  Tspan,
} from '@react-pdf/renderer'

import { FONT_FAMILY } from './pdf.styles'
import { normalizePathData } from './pdf-path'

// Live SVG DOM (recharts, icons, the logo, the miniglobe) → react-pdf vector primitives.
// Elements must be attached to the document so computed styles (CSS-module fills, fonts)
// are resolved the same way the browser painted them.

const ELEMENTS: Record<string, ComponentType<any>> = {
  g: G,
  path: Path,
  rect: Rect,
  circle: Circle,
  ellipse: Ellipse,
  line: Line,
  polyline: Polyline,
  polygon: Polygon,
  text: Text,
  tspan: Tspan,
  defs: Defs,
  clipPath: ClipPath,
  linearGradient: LinearGradient,
  radialGradient: RadialGradient,
  stop: Stop,
}

const GEOMETRY_ATTRIBUTES = new Set([
  'x',
  'y',
  'x1',
  'x2',
  'y1',
  'y2',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'd',
  'points',
  'width',
  'height',
  'transform',
  'id',
  'offset',
  'gradientUnits',
  'gradientTransform',
  'clip-path',
  'dx',
  'dy',
  'stop-color',
  'stop-opacity',
  'fill-rule',
  'clip-rule',
])

const toCamelCase = (name: string) => name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())

const toHex = (channel: string) => Math.round(parseFloat(channel)).toString(16).padStart(2, '0')

// Computed paints are `rgb()` / `rgba()`, which pdfkit's SVG painter does not parse:
// returned as hex plus the alpha to multiply into the matching opacity
export function toPdfPaint(value: string): { paint: string; alpha: number } {
  const rgb = value.match(/^rgba?\(([^)]+)\)$/)
  if (!rgb) return { paint: value.replace(/url\("?([^")]+)"?\)/, 'url($1)'), alpha: 1 }
  const [r, g, b, a = '1'] = rgb[1].split(/[\s,/]+/)
  return { paint: `#${toHex(r)}${toHex(g)}${toHex(b)}`, alpha: parseFloat(a) }
}

function getPresentation(element: Element) {
  const style = getComputedStyle(element)
  const fill = toPdfPaint(style.fill)
  const stroke = toPdfPaint(style.stroke)
  const props: Record<string, string | number> = { fill: fill.paint, stroke: stroke.paint }
  const strokeWidth = parseFloat(style.strokeWidth)
  if (!Number.isNaN(strokeWidth)) props.strokeWidth = strokeWidth
  if (style.opacity !== '1') props.opacity = parseFloat(style.opacity)
  const fillOpacity = parseFloat(style.fillOpacity) * fill.alpha
  if (fillOpacity !== 1) props.fillOpacity = fillOpacity
  const strokeOpacity = parseFloat(style.strokeOpacity) * stroke.alpha
  if (strokeOpacity !== 1) props.strokeOpacity = strokeOpacity
  if (style.strokeDasharray !== 'none') props.strokeDasharray = style.strokeDasharray
  if (style.strokeLinecap !== 'butt') props.strokeLinecap = style.strokeLinecap
  if (style.strokeLinejoin !== 'miter') props.strokeLinejoin = style.strokeLinejoin
  if (element.tagName === 'text' || element.tagName === 'tspan') {
    props.fontFamily = FONT_FAMILY as unknown as string
    props.fontSize = parseFloat(style.fontSize)
    props.fontWeight = parseInt(style.fontWeight) >= 500 ? 500 : 400
    if (style.textAnchor !== 'start') props.textAnchor = style.textAnchor
    if (style.textTransform !== 'none') props.textTransform = style.textTransform
  }
  return props
}

function isHidden(element: Element) {
  if (element.classList.contains('print-hidden')) return true
  const style = getComputedStyle(element)
  return style.display === 'none' || style.visibility === 'hidden'
}

function convertNode(node: Node, key: number, textTransform?: string): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim()
    if (!text) return null
    return textTransform === 'uppercase' ? text.toUpperCase() : text
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return null
  const element = node as Element
  const Component = ELEMENTS[element.tagName]
  if (!Component || isHidden(element)) return null

  const props: Record<string, any> = {}
  for (const { name, value } of Array.from(element.attributes)) {
    if (GEOMETRY_ATTRIBUTES.has(name)) {
      if (name === 'd') props.d = normalizePathData(value)
      else if (name === 'stop-color') props.stopColor = toPdfPaint(value).paint
      else props[toCamelCase(name)] = value
    }
  }
  const isPaintServer = element.tagName === 'stop' || ELEMENTS[element.tagName] === ClipPath
  const presentation = isPaintServer ? {} : getPresentation(element)
  const { textTransform: transform, ...rest } = presentation
  const children = Array.from(element.childNodes).map((child, i) =>
    convertNode(child, i, (transform as string) || textTransform)
  )
  return (
    <Component key={key} {...rest} {...props}>
      {children}
    </Component>
  )
}

// Converts eagerly: the result no longer needs the DOM node, which may be gone by the
// time react-pdf lays the document out.
export function svgToPdf(svg: SVGSVGElement, { width, height }: { width: number; height?: number }) {
  const rect = svg.getBoundingClientRect()
  const viewBox = svg.getAttribute('viewBox') || `0 0 ${rect.width} ${rect.height}`
  const [, , viewBoxWidth, viewBoxHeight] = viewBox.split(/[\s,]+/).map(Number)
  const svgHeight = height ?? (width * viewBoxHeight) / viewBoxWidth
  const sizes = [viewBoxWidth, viewBoxHeight, width, svgHeight]
  if (!sizes.every((size) => Number.isFinite(size) && size > 0)) return null
  // react-pdf leaves a zero-height fragment of an Svg moved to the next page, and its
  // `meet` math divides by that height. With matching ratios `none` draws the same.
  const sameRatio = Math.abs(width / svgHeight - viewBoxWidth / viewBoxHeight) < 0.01
  return (
    <Svg
      width={width}
      height={svgHeight}
      viewBox={viewBox}
      preserveAspectRatio={sameRatio ? 'none' : (svg.getAttribute('preserveAspectRatio') ?? undefined)}
      style={{ width, height: svgHeight, flexShrink: 0 }}
    >
      {Array.from(svg.childNodes).map((child, i) => convertNode(child, i))}
    </Svg>
  )
}

// For SVG React components that are not on screen (logo, icons, miniglobe): render them
// off-screen so their CSS modules apply, convert, then unmount.
export function reactSvgToPdf(element: ReactElement, size: { width: number; height?: number }) {
  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;left:-10000px;top:0;'
  document.body.appendChild(container)
  const root = createRoot(container)
  try {
    flushSync(() => root.render(element))
    const svg = container.querySelector('svg')
    return svg ? svgToPdf(svg, size) : null
  } finally {
    root.unmount()
    container.remove()
  }
}
