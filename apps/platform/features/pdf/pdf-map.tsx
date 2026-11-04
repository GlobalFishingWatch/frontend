import type { Deck } from '@deck.gl/core'
import { Image, Text, View } from '@react-pdf/renderer'

import { MiniGlobe } from '@globalfishingwatch/ui-components'

import { getMapScale } from 'features/_map/map/controls/MapScaleControl'
import { MAP_CANVAS_ID } from 'features/_map/map/map.config'
import { getMapViewport } from 'features/_map/map/map-viewport.hooks'
import { t } from 'features/i18n/i18n'
import { formatI18nDate } from 'features/i18n/i18nDate.utils'
import { pickDateFormatByRange } from 'utils/dates'

import { COLORS, FONTS, px } from './pdf.styles'
import { reactSvgToPdf } from './pdf-svg'

// Map as printed: canvas pixels plus the overlays the print CSS keeps (MapControls,
// MapInfo, MapScaleControl print rules): miniglobe top left, scale and dates next to it.

const PAGE_CONTENT_HEIGHT_CM = 29.7 - 2
// `#map` print max-height in routes/styles.css: calc(29.7cm - (1cm * 2) - 7rem)
const MAP_MAX_HEIGHT = (PAGE_CONTENT_HEIGHT_CM / 2.54) * 72 - px(70)
const MINIGLOBE_SIZE = 60

export type PdfMapData = {
  image: string
  /** Canvas buffer size: the print shows the canvas at it (`width: auto`), see #map */
  pixelWidth: number
  pixelHeight: number
  miniglobe: ReturnType<typeof reactSvgToPdf>
  scale?: { label: string; width: number }
  dates?: string
}

export function captureMap(
  deck: Deck,
  timerange?: { start: string; end: string }
): PdfMapData | null {
  const canvas = document.getElementById(MAP_CANVAS_ID) as HTMLCanvasElement | null
  const viewport = getMapViewport(deck)
  if (!canvas || !viewport) return null
  // No preserveDrawingBuffer: draw and read in the same task, before the buffer is swapped
  deck.redraw('pdf')
  const image = canvas.toDataURL('image/jpeg', 0.92)

  const [west, north] = viewport.unproject([0, 0])
  const [east, south] = viewport.unproject([viewport.width, viewport.height])
  const miniglobe = reactSvgToPdf(
    <MiniGlobe
      size={MINIGLOBE_SIZE}
      viewportThickness={3}
      bounds={{ north, south, west, east }}
      center={{ latitude: viewport.latitude, longitude: viewport.longitude }}
    />,
    { width: px(MINIGLOBE_SIZE) }
  )
  const scale = getMapScale(viewport)
  const format = timerange && pickDateFormatByRange(timerange.start, timerange.end)
  return {
    image,
    pixelWidth: canvas.width,
    pixelHeight: canvas.height,
    miniglobe,
    scale: {
      label: `${scale.distance} ${t((t) => t.map.nauticalMilesAbbr)}`,
      width: scale.width,
    },
    dates: timerange
      ? `${formatI18nDate(timerange.start, { format })} - ${formatI18nDate(timerange.end, { format })}`
      : undefined,
  }
}

// `#map` print rule: intrinsic size, at most the page width and MAP_MAX_HEIGHT
const getImageSize = (map: PdfMapData, width: number) => {
  const scale = Math.min(px(1), width / map.pixelWidth, MAP_MAX_HEIGHT / map.pixelHeight)
  return { width: map.pixelWidth * scale, height: map.pixelHeight * scale }
}

export const getPdfMapHeight = (map: PdfMapData, width: number) => getImageSize(map, width).height

export function PdfMap({ map, width }: { map: PdfMapData; width: number }) {
  const image = getImageSize(map, width)
  return (
    <View style={{ width, height: image.height, backgroundColor: COLORS.mapBackground }}>
      <Image src={map.image} style={image} />
      <View
        style={{
          position: 'absolute',
          top: px(8),
          left: px(8),
          width: px(MINIGLOBE_SIZE),
          height: px(MINIGLOBE_SIZE),
        }}
      >
        {map.miniglobe}
      </View>
      <View style={{ position: 'absolute', top: px(22), left: px(75), paddingHorizontal: px(4) }}>
        {map.scale && (
          <Text
            style={{
              ...FONTS.XS,
              width: px(map.scale.width),
              minHeight: px(15),
              color: 'rgba(255, 255, 255, 0.65)',
              borderBottomWidth: px(1),
              borderBottomColor: 'rgba(255, 255, 255, 0.65)',
            }}
          >
            {map.scale.label}
          </Text>
        )}
        {map.dates && (
          <Text style={{ ...FONTS.L, color: COLORS.white, textTransform: 'uppercase' }}>
            {map.dates}
          </Text>
        )}
      </View>
    </View>
  )
}
