import { validate as mapboxStyleValidator } from '@globalfishingwatch/maplibre-gl/dist/style-spec'

import { DEFAULT_STYLE } from './config'
import generators from './generators'
import { LayerComposer } from '.'

test('instanciates with the default config', async () => {
  const layerComposer = new LayerComposer()
  const objectToMatch = { ...DEFAULT_STYLE }
  const { style } = layerComposer.getGLStyle([])
  expect(style).toMatchObject(objectToMatch)
  // expect(layerComposer.getGLStyle(glyphPath)).toMatchSnapshot()
})

test('instanciates with the defaultGenerators config', async () => {
  const layerComposerConfig = { generators }
  const layerComposer = new LayerComposer(layerComposerConfig)
  const objectToMatch = { ...DEFAULT_STYLE }
  const { style } = layerComposer.getGLStyle([])
  expect(style).toMatchObject(objectToMatch)
  // expect(layerComposer.getGLStyle(glyphPath)).toMatchSnapshot()
})

test('check valid style.json format', async () => {
  const layerComposer = new LayerComposer()
  const { style } = layerComposer.getGLStyle([])
  const errors = mapboxStyleValidator(style)
  if (errors.length) {
    console.warn('Errors found in style validation:', errors)
  }
  expect(errors.length).toBe(0)
})
