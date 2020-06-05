import { validate as mapboxStyleValidator } from '@mapbox/mapbox-gl-style-spec'
import LayerComposer from '../..'
import { Type } from '../types'

test('check valid style.json format', async () => {
  const layerComposer = new LayerComposer()
  const { style } = layerComposer.getGLStyle([
    {
      type: Type.Basemap,
      id: 'satellite',
    },
    {
      type: Type.Background,
      id: 'graticules',
    },
    {
      type: Type.Basemap,
      id: 'landmass',
    },
  ])
  const errors = mapboxStyleValidator(style)
  if (errors.length) {
    console.log('Errors found in style validation:', errors)
  }
  expect(errors.length).toBe(0)
})
