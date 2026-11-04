import type { Deck } from '@deck.gl/core'
import { Document, Page, pdf, View } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'

import { Logo } from '@globalfishingwatch/ui-components'

import { SCROLL_CONTAINER_DOM_ID } from 'features/_map/sidebar/sidebar.utils'

import { pdfStyles, px, registerPdfFonts } from './pdf.styles'
import { domToPdf } from './pdf-dom'
import { captureMap, getPdfMapHeight, PdfMap } from './pdf-map'
import { withPrintStyles } from './pdf-print-styles'
import { reactSvgToPdf } from './pdf-svg'

// A4 minus the 1cm margins
const CONTENT_WIDTH = ((21 - 2) / 2.54) * 72
// <Logo> renders at its 200 x 60 width / height attributes
const LOGO_WIDTH = px(200)
const LOGO_HEIGHT = px(60)

type DownloadSidebarPdfParams = {
  deck: Deck
  filename: string
  title: string
  timerange?: { start: string; end: string }
}

// Same composition as the print layout: GFW logo, the map, then the sidebar
// (layouts.module.css prints the split view as a column with the map first).
export async function downloadSidebarPdf({
  deck,
  filename,
  title,
  timerange,
}: DownloadSidebarPdfParams) {
  registerPdfFonts()
  // Before the print rules resize the canvas
  const map = captureMap(deck, timerange)
  const logo = reactSvgToPdf(<Logo />, { width: LOGO_WIDTH, height: LOGO_HEIGHT })
  const offset = LOGO_HEIGHT + (map ? getPdfMapHeight(map, CONTENT_WIDTH) : 0)
  const content = await withPrintStyles(() => {
    const sidebar = document.getElementById(SCROLL_CONTAINER_DOM_ID)?.parentElement
    return sidebar ? domToPdf(sidebar, { width: CONTENT_WIDTH, offset }) : null
  })

  // DEBUG-REMOVE
  const outline = (n: any, depth: number): string[] => {
    if (!n || typeof n !== 'object' || depth > 30) return []
    const kids = ([] as any[]).concat(n.props?.children ?? []).flat(Infinity)
    const text = kids
      .filter((k) => typeof k === 'string')
      .join('')
      .slice(0, 30)
    const line = `${'  '.repeat(depth)}${String(n.type)} ${JSON.stringify(n.props?.style ?? {})}${n.props?.wrap === false ? ' NOWRAP' : ''} ${text}`
    return [line, ...kids.flatMap((k) => outline(k, depth + 1))]
  }
  console.warn(
    'PDFOUTLINE\n' +
      outline(content, 0)
        .map((l) => l.slice(0, 260))
        .join('\n')
  )
  const blob = await pdf(
    <Document title={title} creator="Global Fishing Watch" producer="Global Fishing Watch">
      <Page size="A4" style={pdfStyles.page}>
        <View style={{ height: LOGO_HEIGHT }}>{logo}</View>
        {map && <PdfMap map={map} width={CONTENT_WIDTH} />}
        {content}
      </Page>
    </Document>
  ).toBlob()
  saveAs(blob, filename)
}
export {
  Document as DebugDocument,
  Page as DebugPage,
  pdf as debugPdf,
  Text,
  View,
} from '@react-pdf/renderer' // DEBUG-REMOVE
