import { validate as mapboxStyleValidator } from '@mapbox/mapbox-gl-style-spec'
import Composer from '../..'
import { HEATMAP_GEOM_TYPES, HEATMAP_COLOR_RAMPS } from '../heatmap/config'
import { Type } from '../types'
import HeatmapGenerator, { DEFAULT_QUANTIZE_OFFSET, toDays } from './heatmap-animated'

const FAST_TILES_API = 'https://fst-tiles-jzzp2ui3wq-uc.a.run.app/v1/'
const START = '2019-01-01T00:00:00.000Z'
const STARTS_AT = toDays(START) - DEFAULT_QUANTIZE_OFFSET
const TILESET = 'fishing_64cells'

test('returns a valid style for a simple static gridded heatmap', async () => {
  const id = 'heatmap_test'

  const LAYER_DEFINITION = {
    id,
    tileset: TILESET,
    type: 'HEATMAP',
    start: START,
    end: '2019-04-01T00:00:00.000Z',
    zoom: 1,
    visible: true,
    geomType: HEATMAP_GEOM_TYPES.GRIDDED,
    colorRamp: HEATMAP_COLOR_RAMPS.PRESENCE,
    colorRampMult: 1,
    fetchStats: false,
    // TBD: Passive layers are visible, with opacity 0, and receive no time updates - allowing them to be toggled on again rapidly but without performance hit
    // passive: false,
    // serverSideFilters: "flag=='ESP'",
  }

  const heatmapGenerator = new HeatmapGenerator({ fastTilesAPI: FAST_TILES_API })
  const heatmapStyle = heatmapGenerator.getStyle(LAYER_DEFINITION)

  const LayerComposer = new Composer()
  const { style } = LayerComposer.getGLStyle([
    {
      type: Type.Heatmap,
      ...LAYER_DEFINITION,
    },
  ])

  // TODO I'm not sure why LM.getStyle sometimes return a style within an object, sometimes not
  const errors = mapboxStyleValidator(style)
  if (errors.length) {
    console.log('Errors found in style validation:', errors)
  }
  expect(errors.length).toBe(0)

  expect(heatmapStyle).toMatchObject({
    id,
    layers: [
      {
        id,
        type: 'fill',
        source: id,
        'source-layer': TILESET,
        layout: {
          visibility: 'visible',
        },
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['to-number', ['get', STARTS_AT.toString()]],
            0,
            'rgba(12, 39, 108, 0)',
            1,
            'rgb(12, 39, 108)',
            91.08999999999999,
            '#114685',
            1351.1349999999998,
            '#00ffc3',
            2611.18,
            '#ffffff',
          ],
        },
      },
    ],
    sources: [
      {
        id,
        type: 'vector',
        tiles: [
          `https://__fast_tiles__/{z}/{x}/{y}?tileset=${TILESET}&geomType=${
            HEATMAP_GEOM_TYPES.GRIDDED
          }&fastTilesAPI=${encodeURIComponent(
            FAST_TILES_API
          )}&quantizeOffset=${DEFAULT_QUANTIZE_OFFSET}&delta=90`,
        ],
      },
    ],
  })
})
